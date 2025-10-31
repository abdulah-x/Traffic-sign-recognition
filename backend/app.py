from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from pathlib import Path
import uvicorn
from io import BytesIO
import traceback
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Traffic Sign Recognition API")

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classes = {
    0: "Speed limit (20km/h)",
    1: "Speed limit (30km/h)",
    2: "Speed limit (50km/h)",
    3: "Speed limit (60km/h)",
    4: "Speed limit (70km/h)",
    5: "Speed limit (80km/h)",
    6: "End of speed limit (80km/h)",
    7: "Speed limit (100km/h)",
    8: "Speed limit (120km/h)",
    9: "No passing",
    10: "No passing for vehicles over 3.5 metric tons",
    11: "Right-of-way at the next intersection",
    12: "Priority road",
    13: "Yield",
    14: "Stop",
    15: "No vehicles",
    16: "Vehicles over 3.5 metric tons prohibited",
    17: "No entry",
    18: "General caution",
    19: "Dangerous curve to the left",
    20: "Dangerous curve to the right",
    21: "Double curve",
    22: "Bumpy road",
    23: "Slippery road",
    24: "Road narrows on the right",
    25: "Road work",
    26: "Traffic signals",
    27: "Pedestrians",
    28: "Children crossing",
    29: "Bicycles crossing",
    30: "Beware of ice/snow",
    31: "Wild animals crossing",
    32: "End of all speed and passing limits",
    33: "Turn right ahead",
    34: "Turn left ahead",
    35: "Ahead only",
    36: "Go straight or right",
    37: "Go straight or left",
    38: "Keep right",
    39: "Keep left",
    40: "Roundabout mandatory",
    41: "End of no passing",
    42: "End of no passing by vehicles over 3.5 metric tons"
}

# Configuration from environment variables
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(Path(__file__).parent / "model" / "traffic_sign_model.keras")))
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB default
ALLOWED_EXTENSIONS = set(os.getenv("ALLOWED_EXTENSIONS", "png,jpg,jpeg,webp").split(","))

model = None
model_error = None

@app.on_event("startup")
def load_model_on_startup():
    global model, model_error
    try:
        if not MODEL_PATH.exists():
            model_error = f"Model file not found: {MODEL_PATH}"
            print(f"⚠️ {model_error}")
            return
        
        model = load_model(str(MODEL_PATH))
        print("✅ Model loaded:", MODEL_PATH)
        print("📊 Input shape:", getattr(model, "input_shape", "Unknown"))
        
    except Exception as e:
        model_error = f"Model loading failed: {str(e)}"
        print(f"❌ {model_error}")
        print("💡 Suggestion: Run 'python retrain_model.py' to fix compatibility issues")

def preprocess_image(image: Image.Image):
    """Preprocess image the same way as in testing code (resize + np.array, no normalization)."""
    image = image.resize((30, 30))
    arr = np.array(image)
    arr = np.expand_dims(arr, axis=0)   # shape (1,30,30,3)
    return arr

@app.get("/")
async def root():
    return {"message": "Traffic Sign Recognition API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy" if model is not None else "degraded",
        "model_loaded": model is not None,
        "model_error": model_error,
        "timestamp": datetime.now().isoformat(),
        "supported_formats": list(ALLOWED_EXTENSIONS),
        "max_file_size_mb": MAX_FILE_SIZE // 1024 // 1024,
        "suggestion": "Run 'python retrain_model.py' if model failed to load" if model_error else None
    }

def validate_file(file: UploadFile) -> tuple[bool, str]:
    """Validate uploaded file type and size."""
    # Check file extension
    if not file.filename:
        return False, "No filename provided"
    
    file_ext = file.filename.split('.')[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        return False, f"File type '.{file_ext}' not allowed. Supported: {', '.join(ALLOWED_EXTENSIONS)}"
    
    # Check content type
    if not file.content_type or not file.content_type.startswith('image/'):
        return False, "Invalid content type. Only image files are allowed"
    
    return True, "Valid file"

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        if model is None:
            return JSONResponse(
                {"error": "Model not loaded", "details": model_error or "Model unavailable", "suggestion": "Run 'python retrain_model.py' to retrain model"}, 
                status_code=503
            )

        # Validate file
        is_valid, validation_message = validate_file(file)
        if not is_valid:
            return JSONResponse(
                {"error": "Invalid file", "details": validation_message}, 
                status_code=400
            )

        # Read and validate file size
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            return JSONResponse(
                {"error": "File too large", "details": f"Maximum size is {MAX_FILE_SIZE // 1024 // 1024}MB"}, 
                status_code=400
            )
        
        # Validate it's actually an image
        try:
            image = Image.open(BytesIO(file_content)).convert("RGB")
        except Exception:
            return JSONResponse(
                {"error": "Invalid image", "details": "File is not a valid image"}, 
                status_code=400
            )
        
        # Check image dimensions (basic validation)
        width, height = image.size
        if width < 10 or height < 10 or width > 5000 or height > 5000:
            return JSONResponse(
                {"error": "Invalid image dimensions", "details": f"Image size {width}x{height} is invalid"}, 
                status_code=400
            )

        # Preprocess and predict
        arr = preprocess_image(image)
        preds = model.predict(arr)
        class_index = int(np.argmax(preds))
        confidence = float(np.max(preds))

        return JSONResponse({
            "class_id": class_index,
            "label": classes.get(class_index, "unknown"),
            "confidence": round(confidence, 4)
        })

    except Exception as e:
        # Log the full error (in production, use proper logging)
        print(f"Prediction error: {str(e)}")
        print(traceback.format_exc())
        
        return JSONResponse({
            "error": "Internal server error", 
            "details": "An unexpected error occurred during prediction"
        }, status_code=500)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
