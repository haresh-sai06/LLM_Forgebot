import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

# Base model (Hugging Face repo)
BASE_MODEL = "meta-llama/Llama-3.1-8B-Instruct"

# Path to your fine-tuned LoRA adapter (must contain adapter_config.json + adapter_model.bin/safetensors)
ADAPTER_PATH = "./fine_tuned_model"

# Output path where merged model will be saved
MERGED_MODEL_PATH = "./merged_model"

def merge_lora():
    # Load base model on CPU
    print("🔹 Loading base model... (this may take a while)")
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.float32,   # safer for CPU
        device_map=None              # disable accelerate offloading
    )

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)

    # Load and attach LoRA adapter
    print("🔹 Loading LoRA adapter...")
    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)

    # Merge LoRA weights into base model
    print("🔹 Merging LoRA weights into base model...")
    model = model.merge_and_unload()

    # Save final merged model
    print(f"🔹 Saving merged model to {MERGED_MODEL_PATH}...")
    model.save_pretrained(MERGED_MODEL_PATH)
    tokenizer.save_pretrained(MERGED_MODEL_PATH)

    print("✅ Merge complete! Merged model is ready at:", MERGED_MODEL_PATH)

if __name__ == "__main__":
    merge_lora()
