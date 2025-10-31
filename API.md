# API Documentation

## Base URL
```
http://localhost:8001
```

## Authentication
No authentication required for current endpoints.

## Endpoints

### GET /
Returns basic API information.

**Response:**
```json
{
  "message": "Traffic Sign Recognition API",
  "version": "1.0.0"
}
```

### GET /health
Health check endpoint for monitoring the API status.

**Response:**
```json
{
  "status": "healthy|degraded",
  "model_loaded": true,
  "model_error": null,
  "timestamp": "2025-10-31T12:00:00.000000",
  "supported_formats": ["png", "jpg", "jpeg", "webp"],
  "max_file_size_mb": 10,
  "suggestion": null
}
```

**Status Codes:**
- `200 OK` - API is healthy
- `503 Service Unavailable` - API is degraded (model not loaded)

### POST /predict
Analyze a traffic sign image and return prediction results.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the image

**Example using curl:**
```bash
curl -X POST http://localhost:8001/predict \
  -F "file=@/path/to/traffic_sign.jpg"
```

**Success Response (200 OK):**
```json
{
  "class_id": 14,
  "label": "Stop",
  "confidence": 0.9876
}
```

**Error Responses:**

**400 Bad Request - Invalid File:**
```json
{
  "error": "Invalid file",
  "details": "File type '.txt' not allowed. Supported: png, jpg, jpeg, webp"
}
```

**400 Bad Request - File Too Large:**
```json
{
  "error": "File too large",
  "details": "Maximum size is 10MB"
}
```

**400 Bad Request - Invalid Image:**
```json
{
  "error": "Invalid image",
  "details": "File is not a valid image"
}
```

**400 Bad Request - Invalid Dimensions:**
```json
{
  "error": "Invalid image dimensions",
  "details": "Image size 5x5 is invalid"
}
```

**503 Service Unavailable - Model Not Loaded:**
```json
{
  "error": "Model not loaded",
  "details": "Model loading failed: ...",
  "suggestion": "Run 'python retrain_model.py' to retrain model"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred during prediction"
}
```

## Traffic Sign Classes

The API recognizes 43 different traffic sign classes:

| Class ID | Sign Name |
|----------|-----------|
| 0 | Speed limit (20km/h) |
| 1 | Speed limit (30km/h) |
| 2 | Speed limit (50km/h) |
| 3 | Speed limit (60km/h) |
| 4 | Speed limit (70km/h) |
| 5 | Speed limit (80km/h) |
| 6 | End of speed limit (80km/h) |
| 7 | Speed limit (100km/h) |
| 8 | Speed limit (120km/h) |
| 9 | No passing |
| 10 | No passing for vehicles over 3.5 metric tons |
| 11 | Right-of-way at the next intersection |
| 12 | Priority road |
| 13 | Yield |
| 14 | Stop |
| 15 | No vehicles |
| 16 | Vehicles over 3.5 metric tons prohibited |
| 17 | No entry |
| 18 | General caution |
| 19 | Dangerous curve to the left |
| 20 | Dangerous curve to the right |
| 21 | Double curve |
| 22 | Bumpy road |
| 23 | Slippery road |
| 24 | Road narrows on the right |
| 25 | Road work |
| 26 | Traffic signals |
| 27 | Pedestrians |
| 28 | Children crossing |
| 29 | Bicycles crossing |
| 30 | Beware of ice/snow |
| 31 | Wild animals crossing |
| 32 | End of all speed and passing limits |
| 33 | Turn right ahead |
| 34 | Turn left ahead |
| 35 | Ahead only |
| 36 | Go straight or right |
| 37 | Go straight or left |
| 38 | Keep right |
| 39 | Keep left |
| 40 | Roundabout mandatory |
| 41 | End of no passing |
| 42 | End of no passing by vehicles over 3.5 metric tons |

## Rate Limits
Currently no rate limits are enforced, but this may change in production.

## File Constraints
- **Maximum file size:** 10MB
- **Supported formats:** PNG, JPG, JPEG, WEBP
- **Image dimensions:** 10x10 to 5000x5000 pixels
- **Color mode:** RGB (automatically converted)

## Error Handling
All errors return JSON responses with `error` and `details` fields. Some may include a `suggestion` field with helpful guidance.

## Interactive Documentation
When the API is running, you can access interactive Swagger documentation at:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`