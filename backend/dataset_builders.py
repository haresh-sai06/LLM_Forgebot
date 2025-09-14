from datasets import Dataset
from typing import List


SYSTEM_DEFAULT = "You are a helpful AI assistant. Use the given context if provided."


def build_sft_from_qa(rows) -> Dataset:
    """rows: pandas DataFrame with instruction,input,output"""
    recs = []
    for r in rows.itertuples(index=False):
        recs.append({
        "instruction": getattr(r, "instruction"),
        "input": getattr(r, "input"),
        "output": getattr(r, "output"),
        "system": SYSTEM_DEFAULT,
        })
    return Dataset.from_list(recs)


def build_cpt_from_chunks(chunks: List[str]) -> Dataset:
    """Continued pretraining: model learns the domain distribution by predicting next tokens.
    We store plain text examples."""
    return Dataset.from_list([{"text": c} for c in chunks])