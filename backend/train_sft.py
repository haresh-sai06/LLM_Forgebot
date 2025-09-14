import os
import json
import time
import torch
from datasets import load_from_disk
from trl import SFTTrainer, SFTConfig


def train(args):
    if args.dataset_type == "sft":
        formatting_func = lambda ex: f"<s>[INST] {ex['instruction']}\n{ex['input']} [/INST]\n{ex['output']}</s>"

        sft_cfg = SFTConfig(
            max_seq_length=2048,
            packing=True,
            output_dir=args.run_dir,
            per_device_train_batch_size=args.per_device_train_batch_size,
            gradient_accumulation_steps=args.gradient_accumulation_steps,
            learning_rate=args.lr,
            num_train_epochs=1.0,
            max_steps=args.max_steps,
            logging_steps=5,
            save_steps=50,
            bf16=args.bf16 and torch.cuda.is_available(),
            report_to=[],
        )

        trainer = SFTTrainer(
            model=model,
            tokenizer=tokenizer,
            train_dataset=ds,
            formatting_func=lambda batch: [formatting_func(ex) for ex in batch],
            args=sft_cfg,
        )

    else:  # CPT
        ds = load_from_disk(args.dataset_path)

        sft_cfg = SFTConfig(
            max_seq_length=2048,
            packing=True,
            output_dir=args.run_dir,
            per_device_train_batch_size=args.per_device_train_batch_size,
            gradient_accumulation_steps=args.gradient_accumulation_steps,
            learning_rate=args.lr,
            num_train_epochs=1.0,
            max_steps=args.max_steps,
            logging_steps=5,
            save_steps=50,
            bf16=args.bf16 and torch.cuda.is_available(),
            dataset_text_field="text",
            report_to=[],
        )

        trainer = SFTTrainer(
            model=model,
            tokenizer=tokenizer,
            train_dataset=ds,
            args=sft_cfg,
        )

    trainer.train()
    model.save_pretrained(os.path.join(args.run_dir, "lora_adapter"))
    tokenizer.save_pretrained(os.path.join(args.run_dir, "lora_adapter"))

    with open(os.path.join(args.run_dir, "train_args.json"), "w") as f:
        json.dump(args.__dict__, f, indent=2)

    return args.run_dir


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--base", required=True)
    p.add_argument("--dataset_type", choices=["sft", "cpt"], required=True)
    p.add_argument("--dataset_path", required=True)
    p.add_argument("--run_dir", required=True)
    p.add_argument("--max_steps", type=int, default=200)
    args = p.parse_args()

    ta = TrainArgs(
        base_model=args.base,
        dataset_type=args.dataset_type,
        dataset_path=args.dataset_path,
        run_dir=args.run_dir,
    )

    train(ta)
