# 🔎 NeuraLens - AI Visual Recognition

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?logo=tensorflow&logoColor=white)

**NeuraLens** is a production-ready AI visual recognition system featuring a modern Next.js frontend and FastAPI backend. Upload images and get instant AI predictions with confidence scores using advanced TensorFlow machine learning models.

Note: While using this App keep in mind that you have to upload image according to input of the model. Also, I am attaching a *folder of test iamges* for testing!! 

## ✨ Features

### 🎯 **Core Functionality**
- **43 Traffic Sign Classes**: Recognizes speed limits, stop signs, yield signs, and more
- **Real-time Predictions**: Get results in seconds with confidence scoring
- **High Accuracy**: Professional-grade ML model with optimized performance

### 🎨 **Enhanced UI/UX**
- **Modern Design**: Beautiful gradient backgrounds with smooth animations
- **Responsive Layout**: Perfect experience on mobile, tablet, and desktop
- **Image Zoom**: Click to zoom uploaded images for better viewing
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Celebration Effects**: Fun animations for high-confidence predictions

### 📊 **Smart Features**
- **Prediction History**: Keep track of your last 10 analyses (stored locally)
- **Confidence Visualization**: Advanced progress bars showing prediction reliability
- **File Validation**: Smart validation with helpful error messages
- **Rate Limiting**: Built-in protection against spam requests
- **Image Compression**: Automatic optimization for faster processing

### 🚀 **Performance & Quality**
- **PWA Ready**: Works offline and can be installed on mobile devices
- **Accessibility**: ARIA labels and keyboard navigation support
- **Error Handling**: Comprehensive error messages with suggestions
- **Analytics**: Built-in usage tracking and performance monitoring

---

## 📂 Project Structure

```
NeuraLens/
├── 📁 backend/                    # FastAPI Python API
│   ├── app.py                     # Main FastAPI server
│   ├── utils.py                   # Helper functions  
│   ├── model/                     # Trained ML model
│   │   ├── traffic_sign_model.h5  # TensorFlow/Keras model (43 classes)
│   │   └── traffic_sign_model.keras
│   └── requirements.txt           # Python dependencies
├── 📁 frontend/                   # Next.js React App
│   ├── src/app/                   # Next.js App Router
│   ├── src/components/            # React components
│   ├── src/hooks/                 # Custom React hooks
│   ├── src/utils/                 # Utility functions
│   ├── public/                    # Static assets & PWA manifest
│   └── package.json               # Node.js dependencies
│   └── utils.py                   # Helper functions
│
├── 🎨 frontend/                   # Next.js React application
│   ├── src/
│   │   ├── app/                   # App router pages
│   │   │   ├── page.tsx           # Main application page
│   │   │   └── globals.css        # Global styles & animations
│   │   ├── components/            # Reusable UI components
│   │   │   ├── upload-box.tsx     # Drag & drop file upload
│   │   │   ├── result-card.tsx    # Results display
│   │   │   ├── loader.tsx         # Loading animations
│   │   │   └── ui/               # Advanced UI components
│   │   │       ├── ConfidenceBar.tsx
│   │   │       ├── ImagePreview.tsx
│   │   │       └── Celebration.tsx
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useFileUpload.ts   # File handling logic
│   │   │   └── usePredictionHistory.ts
│   │   └── utils/                 # Utility functions
│   │       ├── imageUtils.ts      # Image processing
│   │       └── analytics.ts       # Usage analytics
│   ├── public/
│   │   ├── manifest.json          # PWA configuration
│   │   └── favicon.png
│   ├── package.json               # Node.js dependencies
│   └── .env.local                 # Environment variables
│
└── 📚 README.md                   # You are here!
```

---

## 🛠️ Technology Stack

### **Backend**
- **FastAPI** - High-performance Python web framework
- **TensorFlow/Keras 3.6.0** - Machine learning model
- **Pillow** - Image processing
- **Uvicorn** - ASGI server

### **Frontend**  
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### **ML Model**
- **43 Traffic Sign Classes** - Comprehensive dataset
- **CNN Architecture** - Convolutional Neural Network
- **Input**: 30x30 RGB images
- **Output**: Class probabilities with confidence scores

---

## 🚀 Quick Start  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/abdulah-x/Traffic-sign-recognition.git
cd NeuraLens
````

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
---

## 📸 Supported Traffic Signs

Our ML model recognizes **43 different traffic sign classes**:

### Speed Limits
- 🚫 Speed limit (20km/h, 30km/h, 50km/h, 60km/h, 70km/h, 80km/h, 100km/h, 120km/h)
- ✅ End of speed limit (80km/h)
- 🔚 End of all speed and passing limits

### Priority Signs  
- 🛑 Stop
- ⚠️ Yield
- 🚸 Priority road
- ➡️ Right-of-way at the next intersection

### Warning Signs
- ⚠️ General caution
- ↩️ Dangerous curve to the left/right  
- 〰️ Double curve
- 🔺 Bumpy road
- � Slippery road
- ❄️ Beware of ice/snow
- 🦌 Wild animals crossing
- � Children crossing
- 🚴 Bicycles crossing
- 🚶 Pedestrians
- 🚧 Road work
- 🚥 Traffic signals

### Prohibition & Mandatory Signs
- � No vehicles, No entry, No passing
- ➡️ Turn directions, Keep right/left
- 🔄 Roundabout mandatory

---

## � Quick Start

### Prerequisites
- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)

### Setup & Run
```bash
# Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8001 --reload

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

### Access
- **App**: http://localhost:3000
- **API**: http://localhost:8001/docs

---

## 🧠 Model Information

### 43 Traffic Sign Classes
Speed limits (20-120 km/h), Stop, Yield, Warnings, Mandatory signs

**Model Specs**: TensorFlow 2.17.0 + Keras 3.6.0 | Input: 30x30x3 RGB | Size: 2.97MB

---

Dataset : [German Traffic Sign Recognition Benchmark](https://www.kaggle.com/datasets/meowmeowmeowmeowmeow/gtsrb-german-traffic-sign?resource=download)

## 📄 License

MIT License - Feel free to use and contribute!

**Support**: [GitHub Issues](https://github.com/abdulah-x/Traffic-sign-recognition/issues) | ⭐ Star if helpful!

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Abdulllah](https://github.com/abdulah-x)

</div>
