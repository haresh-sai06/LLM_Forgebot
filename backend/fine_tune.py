from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments
import sys
import json

if __name__ == "__main__":
    model_id = sys.argv[1]  # e.g., "litebot-3b"
    data_path = sys.argv[2]  # e.g., "data_xxx.jsonl"
    output_id = sys.argv[3]  # e.g., "output_model"

    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(model_id)

    # Read and process data (simplified)
    with open(data_path, "r") as f:
        data = [json.loads(line) for line in f if line.strip()]

    # Prepare training arguments
    training_args = TrainingArguments(
        output_dir=output_id,
        num_train_epochs=1,
        per_device_train_batch_size=1,
        save_steps=10,
        save_total_limit=2,
    )

    # Train (placeholder)
    trainer = Trainer(model=model, args=training_args, train_dataset=data)
    trainer.train()

    # Save the model
    output_dir = "./fine_tuned_model"
    trainer.model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    model.save_pretrained(output_id)
    print(f"Training completed for {output_id}")