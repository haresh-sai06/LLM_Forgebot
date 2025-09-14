# backend/model_registry.py
def list_models():
    return [
        {
            "id": 1,
            "name": "LiteBot 3B",
            "size": "3B",
            "category": "Basic",
            "trainingTime": "30 min",
            "memoryUse": "4GB",
            "license": "Apache 2.0",
            "featured": False,
            "capabilities": ["General chat", "Basic Q&A", "Light context handling"],
            "badgeColor": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        },
        {
            "id": 2,
            "name": "MidRange 7B",
            "size": "7B",
            "category": "Pro",
            "trainingTime": "1.5 hrs",
            "memoryUse": "8GB",
            "license": "MIT",
            "featured": True,
            "capabilities": ["Advanced chat", "Document Q&A", "Good context retention", "Basic reasoning"],
            "badgeColor": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        },
        {
            "id": 3,
            "name": "PowerBot 13B",
            "size": "13B",
            "category": "Advanced",
            "trainingTime": "3 hrs",
            "memoryUse": "16GB",
            "license": "MIT",
            "featured": False,
            "capabilities": ["Complex reasoning", "Long context window", "Specialized knowledge", "Code generation"],
            "badgeColor": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        },
        {
            "id": 4,
            "name": "Ultra 30B",
            "size": "30B",
            "category": "Advanced",
            "trainingTime": "8 hrs",
            "memoryUse": "32GB",
            "license": "CC BY-NC",
            "featured": False,
            "capabilities": ["Human-like chat", "Expert reasoning", "Creative content", "Specialized domains"],
            "badgeColor": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        },
        {
            "id": 5,
            "name": "DreamWeaver v1.5",
            "size": "4GB",
            "category": "Image Generation",
            "trainingTime": "N/A",
            "memoryUse": "4GB+ VRAM recommended",
            "license": "CreativeML Open RAIL-M",
            "featured": True,
            "capabilities": [
                "Generate high-quality images from text prompts",
                "Supports cyberpunk, realistic, and artistic styles",
                "Local inference for privacy"
            ],
            "badgeColor": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        }
    ]
def get_model(model_id: str):
    models = list_models()
    for model in models:
        if model["id"] == model_id:
            return model
    return None
