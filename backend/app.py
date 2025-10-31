from fastapi import FastAPI, UploadFile, File, Request, HTTPException
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
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import logging
import mimetypes
import hashlib
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

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
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(Path(__file__).parent / "model" / "traffic_sign_model.h5")))
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB default
ALLOWED_EXTENSIONS = set(os.getenv("ALLOWED_EXTENSIONS", "png,jpg,jpeg,webp").split(","))

model = None
model_error = None

def load_ml_model():
    """Load the machine learning model at startup."""
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
        print("💡 Suggestion: Check model file format or path")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    load_ml_model()
    yield
    # Shutdown - nothing to cleanup

# Create FastAPI app with lifespan
app = FastAPI(title="Traffic Sign Recognition API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image: Image.Image):
    """Preprocess image the same way as in testing code (resize + np.array, no normalization)."""
    image = image.resize((30, 30))
    arr = np.array(image)
    arr = np.expand_dims(arr, axis=0)   # shape (1,30,30,3)
    return arr

def validate_file_security(file: UploadFile) -> tuple[bool, str]:
    """Enhanced security validation for uploaded files."""
    try:
        # Check file size
        if hasattr(file, 'size') and file.size and file.size > MAX_FILE_SIZE:
            return False, f"File too large. Max size: {MAX_FILE_SIZE/1024/1024:.1f}MB"
        
        # Validate MIME type
        if file.content_type and not file.content_type.startswith('image/'):
            return False, f"Invalid content type: {file.content_type}. Only images allowed."
        
        # Check file extension
        if file.filename:
            extension = Path(file.filename).suffix.lower().lstrip('.')
            if extension not in ALLOWED_EXTENSIONS:
                return False, f"Invalid file extension: .{extension}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        
        # Validate file signature (magic bytes) for common image formats
        file_content = file.file.read(32)  # Read first 32 bytes
        file.file.seek(0)  # Reset file pointer
        
        # Check magic bytes for image formats
        image_signatures = {
            b'\x89PNG\r\n\x1a\n': 'PNG',
            b'\xff\xd8\xff': 'JPEG',
            b'RIFF': 'WEBP'
        }
        
        is_valid_image = False
        for signature in image_signatures:
            if file_content.startswith(signature):
                is_valid_image = True
                break
        
        if not is_valid_image:
            return False, "Invalid image file format or corrupted file"
        
        return True, "File validation passed"
        
    except Exception as e:
        logger.error(f"File validation error: {e}")
        return False, f"File validation failed: {str(e)}"

def calculate_file_hash(file_content: bytes) -> str:
    """Calculate SHA256 hash of file content for caching/deduplication."""
    return hashlib.sha256(file_content).hexdigest()

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
@limiter.limit("10/minute")  # Rate limiting: 10 requests per minute
async def predict(request: Request, file: UploadFile = File(...)):
    start_time = datetime.now().timestamp()
    try:
        if model is None:
            return JSONResponse(
                {"error": "Model not loaded", "details": model_error or "Model unavailable", "suggestion": "Run 'python retrain_model.py' to retrain model"}, 
                status_code=503
            )

        # Enhanced security validation
        is_valid, validation_message = validate_file_security(file)
        if not is_valid:
            logger.warning(f"File validation failed: {validation_message}")
            return JSONResponse(
                {"error": "File validation failed", "details": validation_message}, 
                status_code=400
            )

        # Read file content
        file_content = await file.read()
        file_hash = calculate_file_hash(file_content)
        
        # Additional size check after reading
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

        # Log successful prediction
        logger.info(f"Prediction successful: class={class_index}, confidence={confidence:.4f}, hash={file_hash[:8]}")

        return JSONResponse({
            "class_id": class_index,
            "label": classes.get(class_index, "unknown"),
            "confidence": round(confidence, 4),
            "processing_time_ms": round((datetime.now().timestamp() - start_time) * 1000, 2),
            "file_hash": file_hash[:8]  # Short hash for tracking
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
