from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
from pathlib import Path
import uvicorn
from io import BytesIO
import traceback
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="NeuraLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for testing, later restrict to your frontend domain
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

# Path to model
MODEL_PATH = Path(r"E:\VIP\ML Stuff\ML Practice project\Sign-Recognition\backend\model\traffic_sign_model.h5")
model = None

@app.on_event("startup")
def load_model_on_startup():
    global model
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
    model = load_model(str(MODEL_PATH))
    print("✅ Model loaded:", MODEL_PATH, " — input_shape:", getattr(model, "input_shape", None))

def preprocess_image(image: Image.Image):
    """Preprocess image the same way as in testing code (resize + np.array, no normalization)."""
    image = image.resize((30, 30))
    arr = np.array(image)
    arr = np.expand_dims(arr, axis=0)   # shape (1,30,30,3)
    return arr

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        if model is None:
            return JSONResponse({"error": "Model not loaded"}, status_code=500)

        data = await file.read()
        image = Image.open(BytesIO(data)).convert("RGB")
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
        tb = traceback.format_exc()
        print(tb)
        return JSONResponse({"error": str(e), "trace": tb}, status_code=500)

# For Vercel deployment
handler = app

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
