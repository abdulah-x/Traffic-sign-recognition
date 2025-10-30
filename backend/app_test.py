from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Traffic Sign Recognition API - Test")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Traffic Sign Recognition API is running!"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": False,
        "message": "Server is running but model needs to be retrained"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return JSONResponse({
        "error": "Model needs to be retrained with compatible TensorFlow version",
        "class_id": 0,
        "label": "Test - Model loading issue",
        "confidence": 0.0
    })

if __name__ == "__main__":
    uvicorn.run("app_test:app", host="0.0.0.0", port=8000, reload=False)