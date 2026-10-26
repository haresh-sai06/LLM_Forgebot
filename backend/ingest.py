import os, re, tempfile
from pathlib import Path
import fitz # PyMuPDF
import pandas as pd


WHITESPACE_RE = re.compile(r"\s+")


def _clean(text: str) -> str:
    text = text.replace("\r", " ")
    text = WHITESPACE_RE.sub(" ", text)
    return text.strip()


def extract_pdf_text(path: str) -> str:
    doc = fitz.open(path)
    try:
        chunks = []
        for page in doc:
            txt = page.get_text("text") or ""
            if txt.strip():
                chunks.append(txt)
        return _clean("\n".join(chunks))
    finally:
        doc.close()


def extract_csv_qa(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    cols = {c.lower(): c for c in df.columns}
    if {"instruction","input","output"}.issubset(cols):
        return df.rename(columns={cols["instruction"]:"instruction", cols["input"]:"input", cols["output"]:"output"})
    elif {"question","answer"}.issubset(cols):
        out = pd.DataFrame({
            "instruction": "Answer this question based on your domain knowledge.",
            "input": df[cols["question"]].astype(str),
            "output": df[cols["answer"]].astype(str),
        })
        return out
    else:
        raise ValueError("CSV must contain instruction/input/output or question/answer columns")


def chunk_text(text: str, max_tokens: int = 512) -> list[str]:
    """Token-approximate chunking by words; swap with tiktoken if desired."""
    words = text.split()
    if not words:
        return []
    approx_tok_per_word = 1.3
    # A non-positive step makes range() raise or loop forever.
    step = max(1, int(max_tokens / approx_tok_per_word))
    out = []
    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i + step])
        if len(chunk) > 50:
            out.append(chunk)
    return out


def _unreadable() -> dict:
    return {"status": "unreadable", "excerpt": "", "chunks": [], "chunkCount": 0}


def _result(text: str) -> dict:
    cleaned = _clean(text)
    if not cleaned:
        return _unreadable()
    chunks = chunk_text(cleaned)
    return {
        "status": "extracted",
        "excerpt": cleaned[:240],
        "chunks": chunks,
        "chunkCount": len(chunks),
    }


def extract_upload(filename: str, data: bytes) -> dict:
    """Extract and chunk one upload. This does not train a model."""
    suffix = Path(filename or "").suffix.lower()
    try:
        if suffix == ".pdf":
            return _result(_pdf_bytes_text(data))
        if suffix == ".csv":
            return _result(_csv_bytes_text(data))
        if suffix in {".txt", ".json", ".md"}:
            return _result(data.decode("utf-8"))
    except Exception:
        return _unreadable()
    return _unreadable()


def _pdf_bytes_text(data: bytes) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, "upload.pdf")
        with open(path, "wb") as handle:
            handle.write(data)
        return extract_pdf_text(path)


def _csv_bytes_text(data: bytes) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, "upload.csv")
        with open(path, "wb") as handle:
            handle.write(data)
        frame = extract_csv_qa(path)
    parts = []
    for row in frame.itertuples(index=False):
        parts.append(" ".join(str(value) for value in row if str(value).strip()))
    return "\n".join(parts)