import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException, WebSocket, Form
from pydantic import BaseModel
from typing import List
import os
import uuid
import json
import requests
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from diffusers import StableDiffusionPipeline
import torch
import asyncio
from queue import Queue
import threading
from io import BytesIO
import base64
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_squared_error
import matplotlib.pyplot as plt
from sqlalchemy import create_engine, text
from RestrictedPython import compile_restricted, safe_globals, limited_builtins
import sqlite3
import numpy as np
import cv2
from PIL import Image
import io

app = FastAPI()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/exports", StaticFiles(directory="exports"), name="exports")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("CORS middleware loaded")

# Initialize global model variable
model = None

# Stable Diffusion model (loaded on demand)
def load_model():
    global model
    if model is None:
        try:
            print("Loading Stable Diffusion model...")
            model = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5",
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
            )
            if torch.cuda.is_available():
                model = model.to("cuda")
            else:
                model = model.to("cpu")
            print("Stable Diffusion model loaded.")
        except Exception as e:
            print(f"Failed to load Stable Diffusion model: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Model loading failed: {str(e)}")
    return model

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "sk_d94c86a5d0aca5ad33d4720ea9292b183b5aa9d91ac256dd")

# SQLite database setup
DATABASE_URL = "sqlite:///uploads/forgebot.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Initialize database
def init_db():
    with sqlite3.connect("uploads/forgebot.db") as conn:
        c = conn.cursor()
        c.execute("""
        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            region TEXT,
            revenue REAL
        )
        """)
        c.execute("SELECT COUNT(*) FROM sales")
        if c.fetchone()[0] == 0:
            c.execute("INSERT INTO sales (region, revenue) VALUES ('North', 1000), ('South', 1500), ('East', 1200), ('West', 800)")
        conn.commit()
init_db()

# Model registry
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
        },
        {
            "id": 6,
            "name": "ElevenLabs TTS",
            "category": "Text-to-Speech",
            "badgeColor": "bg-blue-900 text-blue-300",
            "featured": True,
            "size": "Cloud-based",
            "trainingTime": "N/A",
            "memoryUse": "Minimal (API-based)",
            "license": "ElevenLabs Terms",
            "capabilities": [
                "Realistic text-to-speech in 70+ languages",
                "Emotional voice modulation (e.g., excited, calm)",
                "Voice cloning for personalization"
            ],
            "badgeColor": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        },
        {
            "id": 7,
            "name": "Data Science Tools",
            "category": "Data Science",
            "badgeColor": "bg-green-900 text-green-300",
            "featured": True,
            "size": "Local + Cloud",
            "trainingTime": "Varies by task",
            "memoryUse": "2GB+ RAM recommended",
            "license": "MIT",
            "capabilities": [
                "Execute Python code for analysis",
                "Automate ML model training and prediction",
                "Generate charts and plots from text",
                "Query SQL databases"
            ],
            "isImageGen": False,
            "isAudioGen": False,
            "isDataScience": True
        }, 
        {
            "id": 8,
            "name": "3D & AR Tools",
            "category": "3D and AR",
            "badgeColor": "bg-teal-900 text-teal-300",
            "featured": True,
            "size": "Local + Cloud",
            "trainingTime": "Varies by task",
            "memoryUse": "4GB+ RAM recommended",
            "license": "MIT",
            "capabilities": [
                "Generate 3D models from text prompts (e.g., 'retro-futuristic android')",
                "Create AR filters with face-tracking effects (e.g., sunglasses)",
                "Export 3D models as GLB for Blender/Unity",
                "Preview AR filters as downloadable videos"
            ],
            "isImageGen": False,
            "isAudioGen": False,
            "isDataScience": False,
            "is3DAR": True
        }
    ]

def get_model(model_id: str):
    models = list_models()
    for model in models:
        if model["id"] == model_id:
            return model
    return None

UPLOAD_DIR = "uploads"
EXPORT_DIR = "exports"
FINE_TUNE_DIR = "fine_tune"
VOICE_DIR = "voices"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)
os.makedirs(FINE_TUNE_DIR, exist_ok=True)
os.makedirs(VOICE_DIR, exist_ok=True)

# Pydantic Models
class FileResponseModel(BaseModel):
    file_id: str
    filename: str
    path: str

class Customization(BaseModel):
    formality: int
    creativity: int
    conciseness: int
    bot_name: str
    system_prompt: str
    temperature: float = 0.7
    max_tokens: int = 256
    context_window: int = 4096

class TrainRequest(BaseModel):
    model_id: str
    files: List[str]
    customization: Customization

class ChatRequest(BaseModel):
    model_id: str
    message: str
    voice_id: str = ""
    language: str = "en"

class CodeExecRequest(BaseModel):
    code: str

class AutoMLRequest(BaseModel):
    dataset_path: str
    task: str
    target_column: str

class ChartRequest(BaseModel):
    data_path: str
    chart_type: str
    x_column: str
    y_column: str
    title: str = ""

class QueryRequest(BaseModel):
    query: str

class ThreeDGenRequest(BaseModel):
    prompt: str
    art_style: str

class ARFilterRequest(BaseModel):
    effect: str
    input_path: str = ""

# ElevenLabs TTS
def generate_tts(text: str, voice_id: str = "", language: str = "en"):
    print(f"Generating TTS: text={text[:50]}..., voice_id={voice_id}, language={language}")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code != 200:
        error_detail = response.json().get("detail", "Unknown error")
        raise HTTPException(status_code=response.status_code, detail=f"TTS generation failed: {error_detail}")
    audio_path = os.path.join(UPLOAD_DIR, f"tts_{uuid.uuid4()}.mp3")
    with open(audio_path, "wb") as f:
        f.write(response.content)
    print(f"TTS generated: {audio_path}")
    return audio_path

# Code Interpreter
def execute_code(code: str):
    try:
        restricted_globals = safe_globals.copy()
        restricted_globals.update(limited_builtins)
        restricted_globals["pd"] = pd
        restricted_globals["plt"] = plt
        compiled_code = compile_restricted(code, "<string>", "exec")
        local_vars = {}
        exec(compiled_code, restricted_globals, local_vars)
        result = local_vars.get("result", "Code executed successfully")
        if isinstance(result, pd.DataFrame):
            return result.to_string()
        return str(result)
    except NameError as e:
        if "__import__" in str(e):
            return "Error: Imports are restricted. Use 'pd' for pandas and 'plt' for matplotlib, which are pre-imported."
        return f"Error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

# AutoML
def run_automl(dataset_path: str, task: str, target_column: str):
    try:
        df = pd.read_csv(dataset_path)
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found")
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns
        df_encoded = pd.get_dummies(df, columns=[col for col in categorical_cols if col != target_column], drop_first=True)
        X = df_encoded.drop(columns=[target_column])
        y = df[target_column]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        if task == "classification":
            model = RandomForestClassifier(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            score = accuracy_score(y_test, y_pred)
        elif task == "regression":
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            score = mean_squared_error(y_test, y_pred, squared=False)
        else:
            raise ValueError("Task must be 'classification' or 'regression'")
        
        model_path = os.path.join(EXPORT_DIR, f"model_{uuid.uuid4()}.joblib")
        import joblib
        joblib.dump(model, model_path)
        return {"score": score, "model_path": model_path}
    except Exception as e:
        return f"Error: {str(e)}"

# Chart Generation
def generate_chart(data_path: str, chart_type: str, x_column: str, y_column: str, title: str):
    try:
        df = pd.read_csv(data_path)
        if x_column not in df.columns or y_column not in df.columns:
            raise ValueError(f"Columns '{x_column}' or '{y_column}' not found")
        
        plt.figure(figsize=(8, 6))
        if chart_type == "bar":
            df.groupby(x_column)[y_column].sum().plot(kind="bar")
        elif chart_type == "line":
            df.plot(x=x_column, y=y_column, kind="line")
        elif chart_type == "pie":
            df.groupby(x_column)[y_column].sum().plot(kind="pie")
        else:
            raise ValueError("Unsupported chart type")
        
        plt.title(title or f"{y_column} by {x_column}")
        chart_path = os.path.join(EXPORT_DIR, f"chart_{uuid.uuid4()}.png").replace("\\", "/")
        plt.savefig(chart_path)
        plt.close()
        with open(chart_path, "rb") as f:
            chart_data = base64.b64encode(f.read()).decode()
        return chart_path, chart_data
    except Exception as e:
        return f"Error: {str(e)}"

# Database Query
def execute_query(query: str):
    try:
        with engine.connect() as connection:
            if query.lower().startswith("select"):
                table_name = query.lower().split("from")[1].split("where")[0].strip()
                result = connection.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name=:table"), {"table": table_name})
                if not result.fetchone():
                    return f"Error: Table '{table_name}' does not exist. Available tables: sales"
            result = connection.execute(text(query))
            if query.lower().startswith("select"):
                rows = result.fetchall()
                columns = result.keys()
                return pd.DataFrame(rows, columns=columns).to_dict(orient="records")
            else:
                connection.commit()
                return "Query executed successfully"
    except Exception as e:
        return f"Error: {str(e)}"

# 3D Model Generation (Placeholder)
def generate_3d_model(prompt: str, art_style: str):
    try:
        # Simulate Meshy-like text-to-3D generation
        # Create a simple cube mesh with placeholder texture
        vertices = np.array([
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],  # Front face
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]       # Back face
        ], dtype=np.float32)
        faces = np.array([
            [0, 1, 2], [2, 3, 0],  # Front
            [5, 4, 7], [7, 6, 5],  # Back
            [4, 5, 1], [1, 0, 4],  # Bottom
            [6, 7, 3], [3, 2, 6],  # Top
            [4, 0, 3], [3, 7, 4],  # Left
            [1, 5, 6], [6, 2, 1]   # Right
        ], dtype=np.int32)
        
        # Generate placeholder texture based on prompt
        texture = np.zeros((256, 256, 3), dtype=np.uint8)
        if "retro-futuristic" in prompt.lower():
            texture[:, :, 0] = 100  # Blue tint
        elif "cartoon" in art_style.lower():
            texture[:, :, 1] = 150  # Green tint
        else:
            texture[:, :, 2] = 200  # Red tint
        
        # Save texture as PNG
        texture_path = os.path.join(EXPORT_DIR, f"texture_{uuid.uuid4()}.png").replace("\\", "/")
        Image.fromarray(texture).save(texture_path)
        
        # Save simple GLB (placeholder, not actual 3D generation)
        glb_path = os.path.join(EXPORT_DIR, f"model_{uuid.uuid4()}.glb").replace("\\", "/")
        with open(glb_path, "wb") as f:
            f.write(b"Placeholder GLB content")  # Simulate GLB file
        return glb_path, texture_path
    except Exception as e:
        return f"Error: {str(e)}"

# AR Filter Generation
def generate_ar_filter(effect: str, input_path: str):
    try:
        # Load default image if no input provided
        if not input_path or not os.path.exists(input_path):
            input_path = None
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
        else:
            frame = cv2.imread(input_path) if input_path.endswith((".jpg", ".png")) else None
            if frame is None:
                cap = cv2.VideoCapture(input_path)
                ret, frame = cap.read()
                cap.release()
                if not ret:
                    raise ValueError("Failed to read input image/video")
        
        # Load face cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        if face_cascade.empty():
            raise ValueError("Failed to load face cascade")
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        # Apply effect (e.g., sunglasses)
        for (x, y, w, h) in faces:
            if effect.lower() == "sunglasses":
                # Simulate sunglasses overlay
                overlay = np.zeros_like(frame)
                cv2.rectangle(overlay, (x+int(w*0.2), y+int(h*0.2)), (x+int(w*0.8), y+int(h*0.4)), (0, 0, 0), -1)
                frame = cv2.addWeighted(frame, 1.0, overlay, 0.5, 0)
            elif effect.lower() == "hat":
                # Simulate hat overlay
                overlay = np.zeros_like(frame)
                cv2.rectangle(overlay, (x+int(w*0.1), y-int(h*0.2)), (x+int(w*0.9), y), (0, 255, 0), -1)
                frame = cv2.addWeighted(frame, 1.0, overlay, 0.5, 0)
        
        # Save preview as video
        output_path = os.path.join(EXPORT_DIR, f"ar_filter_{uuid.uuid4()}.mp4").replace("\\", "/")
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, 30.0, (frame.shape[1], frame.shape[0]))
        out.write(frame)
        out.release()
        
        return output_path
    except Exception as e:
        return f"Error: {str(e)}"

# Existing Endpoints
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/models")
def get_models():
    return {"models": list_models()}

@app.get("/models/{model_id}")
def get_model_details(model_id: str):
    model = get_model(model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

@app.get("/voices")
async def get_voices():
    print("Fetching ElevenLabs voices")
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        error_detail = response.json().get("detail", "Unknown error")
        raise HTTPException(status_code=response.status_code, detail=f"Failed to fetch voices: {error_detail}")
    print(f"Voices fetched: {len(response.json()['voices'])} voices")
    return response.json()

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    uploaded = []
    for file in files:
        print(f"Received file: {file.filename}, size: {file.size} bytes")
        file_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}").replace("\\", "/")
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        uploaded.append({"file_id": file_id, "filename": file.filename, "path": file_path})
    print(f"Uploaded files: {uploaded}")
    return {"uploaded_files": uploaded}

@app.delete("/files/{file_id}")
async def delete_file(file_id: str):
    for file in os.listdir(UPLOAD_DIR):
        if file.startswith(file_id):
            os.remove(os.path.join(UPLOAD_DIR, file))
            return {"message": "File deleted"}
    raise HTTPException(status_code=404, detail="File not found")

@app.post("/customize")
async def save_customization(custom: Customization):
    return {"message": "Customization saved", "data": custom.dict()}

@app.post("/train")
async def train_bot(request: TrainRequest):
    print("Received /train request with:", request.dict())
    data_path = os.path.join(FINE_TUNE_DIR, f"data_{uuid.uuid4()}.jsonl").replace("\\", "/")
    with open(data_path, "w") as f:
        for file_path in request.files:
            with open(file_path, "r") as data_file:
                content = data_file.read()
                f.write(json.dumps({"instruction": content[:100], "response": "Sample response"}) + "\n")
    fine_tuned_model_id = str(uuid.uuid4())
    print(f"Simulating training for model {request.model_id} with data {data_path}")
    export_path = os.path.join(EXPORT_DIR, f"{fine_tuned_model_id}.zip").replace("\\", "/")
    with open(export_path, "wb") as f:
        f.write(b"Fine-tuned model content")
    return {"message": "Training complete", "trained_model_id": fine_tuned_model_id}

@app.get("/export/{trained_model_id}")
async def export_bot(trained_model_id: str):
    export_path = os.path.join(EXPORT_DIR, f"{trained_model_id}.zip").replace("\\", "/")
    if not os.path.exists(export_path):
        raise HTTPException(status_code=404, detail="Model not found")
    return FileResponse(export_path, filename="trained_bot.zip")

@app.post("/chat")
async def chat(request: ChatRequest):
    model_id = request.model_id
    message = request.message
    voice_id = request.voice_id
    language = request.language
    if not model_id or not message:
        raise HTTPException(status_code=400, detail="model_id and message are required")
    
    print(f"Chat request: model_id={model_id}, message={message[:50]}..., voice_id={voice_id}")
    response_text = f"Response from {model_id} to: {message}"
    audio_url = None
    if model_id == "elevenlabs-tts":
        try:
            audio_path = generate_tts(message, voice_id, language)
            audio_url = f"/uploads/{os.path.basename(audio_path)}"
            print(f"Chat audio generated: {audio_url}")
        except Exception as e:
            print(f"Chat TTS error: {e}")
    
    return {"response": response_text, "audio_url": audio_url}

@app.post("/upload-voice")
async def upload_voice(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(VOICE_DIR, f"{file_id}_{file.filename}").replace("\\", "/")
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    voice_id = f"cloned_{file_id}"
    print(f"Voice uploaded: {file_path} (simulated cloning)")
    return {"voice_id": voice_id, "message": "Voice uploaded (simulated cloning)"}

@app.post("/music-gen")
async def music_gen(prompt: str = Form(...)):
    audio_path = os.path.join(UPLOAD_DIR, f"music_{uuid.uuid4()}.mp3").replace("\\", "/")
    with open(audio_path, "wb") as f:
        f.write(b"Simulated music content")
    print(f"Simulated music generated: {audio_path}")
    return {"audio_url": f"/uploads/{os.path.basename(audio_path)}"}

@app.websocket("/ws/image-gen")
async def image_gen_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/image-gen connected")
    data = await websocket.receive_json()
    prompt = data.get("prompt")
    print(f"Received image prompt: {prompt}")
    if not prompt:
        await websocket.send_text("Error: No prompt provided.")
        await websocket.close()
        return

    progress_queue = Queue()
    num_steps = 50

    def generation_callback(step: int, timestep, latents):
        progress = int((step / num_steps) * 100)
        print(f"Image generation step {step}/{num_steps}, progress: {progress}%")
        progress_queue.put(progress)

    def generate_image():
        try:
            loaded_model = load_model()  # Load the model
            if loaded_model is None:
                raise ValueError("Failed to load the model")
            print("Starting image generation")
            image = loaded_model(
                prompt,
                num_inference_steps=num_steps,
                callback=generation_callback,
                callback_steps=1
            ).images[0]
            # Send the image as base64 to the frontend
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode()
            progress_queue.put(("done", img_str))
        except Exception as e:
            progress_queue.put(("error", str(e)))

    thread = threading.Thread(target=generate_image)
    thread.start()
    print("Image generation thread started")

    while True:
        item = await asyncio.get_running_loop().run_in_executor(None, progress_queue.get)
        print(f"Sending to frontend: {item}")
        if isinstance(item, tuple) and item[0] == "done":
            await websocket.send_text(f"Image: {item[1]}")
            break
        elif isinstance(item, tuple) and item[0] == "error":
            await websocket.send_text(f"Error: {item[1]}")
            break
        else:
            await websocket.send_text(f"Progress: {item}")

    thread.join()
    await websocket.close()
    print("WebSocket /ws/image-gen closed")

@app.websocket("/ws/audio-gen")
async def audio_gen_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/audio-gen connected")
    data = await websocket.receive_json()
    text = data.get("text")
    voice_id = data.get("voice_id", "")
    language = data.get("language", "en")
    print(f"Received: text={text[:50]}..., voice_id={voice_id}, language={language}")
    if not text:
        await websocket.send_text("Error: No text provided.")
        await websocket.close()
        return
    if not voice_id:
        await websocket.send_text("Error: No voice selected.")
        await websocket.close()
        return

    try:
        await websocket.send_text("Generating audio...")
        audio_path = generate_tts(text, voice_id, language)
        print(f"Audio generated at {audio_path}")
        with open(audio_path, "rb") as f:
            audio_data = f.read()
        audio_base64 = base64.b64encode(audio_data).decode()
        await websocket.send_text(f"Audio: {audio_base64}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_text(f"Error: {e}")
    finally:
        await websocket.close()
        print("WebSocket /ws/audio-gen closed")

@app.websocket("/ws/code-exec")
async def code_exec_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/code-exec connected")
    data = await websocket.receive_json()
    code = data.get("code")
    print(f"Received code: {code[:50]}...")
    if not code:
        await websocket.send_text("Error: No code provided.")
        await websocket.close()
        return

    try:
        await websocket.send_text("Executing code...")
        result = execute_code(code)
        await websocket.send_text(f"Result: {result}")
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()
        print("WebSocket /ws/code-exec closed")

@app.websocket("/ws/automl")
async def automl_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/automl connected")
    data = await websocket.receive_json()
    dataset_path = data.get("dataset_path")
    task = data.get("task")
    target_column = data.get("target_column")
    print(f"Received AutoML: dataset={dataset_path}, task={task}, target={target_column}")
    if not all([dataset_path, task, target_column]):
        await websocket.send_text("Error: Missing dataset_path, task, or target_column.")
        await websocket.close()
        return

    try:
        await websocket.send_text("Running AutoML...")
        result = run_automl(dataset_path, task, target_column)
        await websocket.send_text(f"Result: {json.dumps(result)}")
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()
        print("WebSocket /ws/automl closed")

@app.websocket("/ws/chart-gen")
async def chart_gen_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/chart-gen connected")
    data = await websocket.receive_json()
    data_path = data.get("data_path")
    chart_type = data.get("chart_type")
    x_column = data.get("x_column")
    y_column = data.get("y_column")
    title = data.get("title", "")
    print(f"Received chart: data={data_path}, type={chart_type}, x={x_column}, y={y_column}")
    if not all([data_path, chart_type, x_column, y_column]):
        await websocket.send_text("Error: Missing required fields.")
        await websocket.close()
        return

    try:
        await websocket.send_text("Generating chart...")
        result = generate_chart(data_path, chart_type, x_column, y_column, title)
        if isinstance(result, tuple):
            chart_path, chart_data = result
            await websocket.send_text(f"Chart: {chart_data}")
        else:
            await websocket.send_text(f"Error: {result}")
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()
        print("WebSocket /ws/chart-gen closed")

@app.websocket("/ws/db-query")
async def db_query_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/db-query connected")
    data = await websocket.receive_json()
    query = data.get("query")
    print(f"Received query: {query[:50]}...")
    if not query:
        await websocket.send_text("Error: No query provided.")
        await websocket.close()
        return

    try:
        await websocket.send_text("Executing query...")
        result = execute_query(query)
        await websocket.send_text(f"Result: {json.dumps(result)}")
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()
        print("WebSocket /ws/db-query closed")

# 3D Model Generation WebSocket
@app.websocket("/ws/3d-gen")
async def three_d_gen_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/3d-gen connected")
    data = await websocket.receive_json()
    prompt = data.get("prompt")
    art_style = data.get("art_style", "realistic")
    print(f"Received 3D prompt: {prompt}, style: {art_style}")
    if not prompt:
        await websocket.send_text("Error: No prompt provided.")
        await websocket.close()
        return

    try:
        await websocket.send_text("Generating 3D model...")
        progress_queue = Queue()
        
        def generate_3d():
            try:
                result = generate_3d_model(prompt, art_style)
                if isinstance(result, tuple):
                    glb_path, texture_path = result
                    with open(texture_path, "rb") as f:
                        texture_data = base64.b64encode(f.read()).decode()
                    progress_queue.put(("done", {"glb_path": glb_path, "texture_data": texture_data}))
                else:
                    progress_queue.put(("error", result))
            except Exception as e:
                progress_queue.put(("error", str(e)))

        thread = threading.Thread(target=generate_3d)
        thread.start()
        print("3D generation thread started")

        while True:
            item = await asyncio.get_running_loop().run_in_executor(None, progress_queue.get)
            print(f"Sending to frontend: {item}")
            if isinstance(item, tuple) and item[0] == "done":
                await websocket.send_text(f"Result: {json.dumps(item[1])}")
                break
            elif isinstance(item, tuple) and item[0] == "error":
                await websocket.send_text(f"Error: {item[1]}")
                break
            else:
                await websocket.send_text(f"Progress: {item}")

        thread.join()
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()
        print("WebSocket /ws/3d-gen closed")

# AR Filter WebSocket
@app.websocket("/ws/ar-filter")
async def ar_filter_ws(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket /ws/ar-filter connected")
    data = await websocket.receive_json()
    effect = data.get("effect")
    input_path = data.get("input_path", "")
    print(f"Received AR filter: effect={effect}, input={input_path}")
    if not effect:
        await websocket.send_text("Error: No effect provided.")
        await websocket.close()
        return

    try:
        await websocket.send_text("Generating AR filter...")
        progress_queue = Queue()
        
        def generate_ar():
            try:
                result = generate_ar_filter(effect, input_path)
                if isinstance(result, str) and not result.startswith("Error"):
                    progress_queue.put(("done", result))
                else:
                    progress_queue.put(("error", result))
            except Exception as e:
                progress_queue.put(("error", str(e)))

        thread = threading.Thread(target=generate_ar)
        thread.start()
        print("AR filter thread started")

        while True:
            item = await asyncio.get_running_loop().run_in_executor(None, progress_queue.get)
            print(f"Sending to frontend: {item}")
            if isinstance(item, tuple) and item[0] == "done":
                await websocket.send_text(f"Result: {item[1]}")
                break
            elif isinstance(item, tuple) and item[0] == "error":
                await websocket.send_text(f"Error: {item[1]}")
                break
            else:
                await websocket.send_text(f"Progress: {item}")

        thread.join()
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
    finally:
        await websocket.close()
        print("WebSocket /ws/ar-filter closed")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)