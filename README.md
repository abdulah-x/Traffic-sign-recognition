# 🚦 Traffic Sign Detective

A full-stack AI-powered traffic sign recognition system that instantly identifies traffic signs from uploaded images using deep learning.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2+-black.svg)](https://nextjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15+-orange.svg)](https://tensorflow.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 What it does

- 📸 **Upload any traffic sign image** through an intuitive web interface
- 🧠 **AI Recognition** using a trained CNN model with **43 traffic sign categories**
- ⚡ **Instant Results** with confidence scores and processing time
- 🎨 **Beautiful UI** with dark theme, animations, and responsive design
- 📊 **Real-time Analytics** tracking predictions and performance

## 🏗️ Architecture

```
Traffic-Sign-Recognition/
│
├── 🎨 frontend/           # Next.js + TypeScript + Tailwind CSS
│   ├── src/app/           # App router pages
│   ├── src/components/    # Reusable UI components  
│   └── public/            # Static assets
│
├── 🔧 backend/            # FastAPI + Python
│   ├── model/             # Trained ML models (.h5, .keras)
│   ├── dataset/           # Training data (43 classes)
│   ├── app.py             # Main FastAPI application
│   └── requirements.txt   # Python dependencies
│
├── 📊 Sign_Recognition.ipynb  # Model training notebook
└── 📚 Documentation/      # Setup guides and API docs
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** 
- **Git**

### 1️⃣ Clone Repository
```bash
git clone https://github.com/abdulah-x/Traffic-sign-recognition.git
cd Traffic-sign-recognition
```

### 2️⃣ Setup Backend
```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
cp .env.example .env
# Edit .env if needed

uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

Backend runs at: **http://localhost:8001**

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local if needed

npm run dev
```

Frontend runs at: **http://localhost:3000**

### 4️⃣ Test the Application
1. Open **http://localhost:3000** in your browser
2. Upload a traffic sign image (PNG, JPG, JPEG)
3. Click "Analyze This Sign!" 
4. See AI prediction with confidence score! 🎉

## 📋 Traffic Sign Categories (43 Classes)

| Class | Sign Type | Class | Sign Type |
|-------|-----------|-------|-----------|
| 0-8 | Speed Limits (20-120 km/h) | 22-31 | Road Conditions & Warnings |
| 9-17 | Prohibitory Signs | 32-42 | Mandatory & Directional Signs |
| 18-21 | Danger Signs | | |

<details>
<summary>📖 View All 43 Classes</summary>

- **Speed Limits:** 20, 30, 50, 60, 70, 80, 100, 120 km/h + End of 80km/h
- **Prohibitory:** No passing, No vehicles, No entry, etc.  
- **Warning Signs:** Dangerous curves, Bumpy road, Children crossing, etc.
- **Mandatory:** Turn right/left, Go straight, Keep right/left, etc.

</details>

## 🔧 API Documentation

### Base URL
```
http://localhost:8001
```

### Endpoints

#### 🟢 Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2025-10-31T12:00:00Z"
}
```

#### 🔮 Predict Traffic Sign  
```http
POST /predict
Content-Type: multipart/form-data
```

**Request:**
- `file`: Image file (PNG, JPG, JPEG, max 10MB)

**Response:**
```json
{
  "class_id": 14,
  "label": "Stop",
  "confidence": 0.9876
}
```

**Error Response:**
```json
{
  "error": "Only image files allowed",
  "details": "File type not supported"
}
```

## 🧠 Model Details

- **Architecture:** Convolutional Neural Network (CNN)
- **Input Size:** 30x30 RGB images  
- **Dataset:** German Traffic Sign Recognition Benchmark (GTSRB)
- **Training Images:** ~39,000 images across 43 classes
- **Accuracy:** ~95% on test set
- **Framework:** TensorFlow/Keras 2.15+

### Model Architecture
```python
Sequential([
    Conv2D(32, (5,5), activation='relu'),
    Conv2D(32, (5,5), activation='relu'), 
    MaxPool2D(2,2), Dropout(0.25),
    
    Conv2D(64, (3,3), activation='relu'),
    Conv2D(64, (3,3), activation='relu'),
    MaxPool2D(2,2), Dropout(0.25),
    
    Flatten(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(43, activation='softmax')  # 43 classes
])
```

## 🎨 Features

### Frontend Features
- ✨ **Modern UI** with dark theme and yellow accents
- 🎭 **Smooth Animations** using Tailwind CSS 
- 📱 **Responsive Design** for all screen sizes
- 🖼️ **Drag & Drop Upload** with image preview
- ⚡ **Real-time Processing** with loading animations
- 📊 **Confidence Visualization** with color-coded progress bars
- 🔄 **Reset Functionality** for multiple predictions
- 📈 **Analytics Counter** tracking total predictions

### Backend Features  
- 🚀 **High Performance** with FastAPI and async support
- 🔒 **Input Validation** for file types and sizes
- 🌐 **CORS Security** with configurable origins
- 📝 **Structured Logging** for monitoring and debugging
- ⚙️ **Environment Configuration** with .env support
- 🏥 **Health Checks** for monitoring deployment status

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Accuracy** | ~95% |
| **Prediction Time** | <500ms |
| **Model Size** | ~3MB |
| **Supported Formats** | PNG, JPG, JPEG, WEBP |
| **Max File Size** | 10MB |
| **Concurrent Users** | 100+ |

## 🔧 Development

### Environment Variables

**Backend (.env)**
```bash
MODEL_PATH=./model/traffic_sign_model.keras
PORT=8001
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=png,jpg,jpeg,webp
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_APP_NAME=Traffic Sign Detective
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### Testing

**Backend Tests:**
```bash
cd backend
pytest tests/ -v
```

**Frontend Tests:**  
```bash
cd frontend
npm test
```

### Code Quality
```bash
# Backend linting
cd backend
black . && flake8 .

# Frontend linting  
cd frontend
npm run lint
```

## 📦 Deployment

### Using Docker
```bash
docker-compose up --build
```

### Individual Services

**Backend (Railway/Render):**
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

**Frontend (Vercel/Netlify):**
```bash
npm run build && npm start
```

### Environment Setup
1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Configure `CORS_ORIGINS` in backend
3. Upload model files to deployment storage
4. Set up monitoring and logging

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow **PEP 8** for Python code
- Use **TypeScript** for new frontend components
- Add **tests** for new features
- Update **documentation** for API changes
- Use **semantic commits** (feat:, fix:, docs:, etc.)

## 📖 Learning Resources

- **Model Training:** See `Sign_Recognition.ipynb` for complete training process
- **API Docs:** Visit `http://localhost:8001/docs` when backend is running
- **Dataset:** [German Traffic Sign Recognition Benchmark](https://benchmark.ini.rub.de/)
- **TensorFlow Guide:** [Image Classification Tutorial](https://www.tensorflow.org/tutorials/images/classification)

## 🐛 Troubleshooting

### Common Issues

**Model Loading Error:**
```
TypeError: Error when deserializing class 'InputLayer'
```
**Solution:** Use `traffic_sign_model.keras` instead of `.h5` format

**Port Already in Use:**
```
Error: Port 8001 is already in use
```
**Solution:** Change port in `.env` or kill existing process

**CORS Error:**
```
Access-Control-Allow-Origin error
```
**Solution:** Check `CORS_ORIGINS` setting in backend `.env`

**File Too Large:**
```
File size exceeds maximum limit
```
**Solution:** Compress image or adjust `MAX_FILE_SIZE` setting

## 📞 Support

- 📫 **Issues:** [GitHub Issues](https://github.com/abdulah-x/Traffic-sign-recognition/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/abdulah-x/Traffic-sign-recognition/discussions)  
- 📧 **Email:** [Your Email Here]

## 🏆 Acknowledgments

- **Dataset:** German Traffic Sign Recognition Benchmark (GTSRB)
- **Icons:** Lucide React Icons
- **Styling:** Tailwind CSS
- **ML Framework:** TensorFlow/Keras
- **Inspiration:** Autonomous vehicle computer vision systems

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=abdulah-x/Traffic-sign-recognition&type=Date)](https://star-history.com/#abdulah-x/Traffic-sign-recognition&Date)

---

<div align="center">

**Built with ❤️ for safer roads through AI**

[🌟 Star this repo](https://github.com/abdulah-x/Traffic-sign-recognition/stargazers) • [🍴 Fork it](https://github.com/abdulah-x/Traffic-sign-recognition/fork) • [📝 Report Bug](https://github.com/abdulah-x/Traffic-sign-recognition/issues)

</div>