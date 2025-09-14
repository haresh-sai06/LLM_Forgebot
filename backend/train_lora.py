import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from peft import LoraConfig, get_peft_model
from datasets import load_dataset

# -------- SETTINGS --------
BASE_MODEL = "meta-llama/Llama-3.1-8B-Instruct"
OUTPUT_DIR = "./fine_tuned_model"

# -------- LOAD MODEL + TOKENIZER --------
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=True)

# Fix for missing pad token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, device_map={"": "cpu"})

# -------- PREPARE LoRA CONFIG --------
lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "v_proj"], 
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora_config)

# -------- LOAD DATASET --------
dataset = load_dataset("imdb", split="train[:1%]")  # demo small dataset

def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, padding="max_length", max_length=128)

dataset = dataset.map(tokenize, batched=True)

# Remove unnecessary columns and set torch tensors
dataset.set_format(type="torch", columns=["input_ids", "attention_mask"])

# -------- DATA COLLATOR --------
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False  # Causal LM
)

# -------- TRAINING ARGS --------
training_args = TrainingArguments(
    output_dir="./results",
    per_device_train_batch_size=2,
    learning_rate=1e-4,
    num_train_epochs=1,
    logging_steps=10,
    save_strategy="epoch",
    fp16=False,  # CPU cannot use fp16
    report_to="none"
)

# -------- TRAINER --------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    data_collator=data_collator,
)

# -------- TRAIN --------
trainer.train()

# -------- SAVE LoRA ADAPTER --------
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print(f"✅ LoRA adapter saved to {OUTPUT_DIR}")
