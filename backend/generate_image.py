import torch
from diffusers import StableDiffusionPipeline

# Load the pipeline (downloads model on first run, ~4-6GB)
pipe = StableDiffusionPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4",  # Or use "stabilityai/stable-diffusion-2-1" for better results
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32  # Half-precision for GPU speed
)
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")  # Move to device
pipe.enable_attention_slicing()  # Memory optimization

# Generate image
prompt = "A futuristic robot forging a sword in a digital anvil, cyberpunk style"
image = pipe(prompt).images[0]  # Inference: ~10-30s on GPU

# Save and display
image.save("output.png")
image.show()  # Or integrate with your bot's output method