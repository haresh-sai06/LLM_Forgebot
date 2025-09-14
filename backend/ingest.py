import os, re
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
    chunks = []
    for page in doc:
        txt = page.get_text("text") or ""
        if txt.strip():
            chunks.append(txt)
        return _clean("\n".join(chunks))


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
    approx_tok_per_word = 1.3
    step = int(max_tokens / approx_tok_per_word)
    out = []
    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i+step])
    if len(chunk) > 50:
        out.append(chunk)
    return out