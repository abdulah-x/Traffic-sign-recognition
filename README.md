# 🚦 Traffic Sign Detective  

An easy-to-use project that can **recognize traffic signs** using Machine Learning.  
It comes with a **Frontend (React)** for users, a **Backend (Node/Express)** for predictions, and a trained **ML model** that does the actual recognition.  

Think of it as a mini self-driving car assistant 🚗✨.  

---

## 📂 Project Structure  

```

Sign-Recognition/
│
├── backend/        # Handles the ML model and API requests
├── frontend/       # User interface (upload image, see predictions)
├── model/          # Trained ML model files
├── data/           # Dataset (optional or linked externally)
└── README.md       # You are here :)

````

---

## ✨ What this project does  

- 📸 **Takes an image** of a traffic sign (uploaded by the user)  
- 🧠 **Recognizes what sign it is** using a trained ML model  
- 🌐 **Shows the result** instantly on a simple website  
- ⚡ Works end-to-end (Frontend ↔ Backend ↔ Model)  

Examples:  
- Upload a 🛑 **Stop Sign** → It says **"Stop"**  
- Upload ⚠️ **Caution Sign** → It says **"Warning"**  
- Upload 🚸 **Children Crossing** → It says **"School Zone"**  

---

## 🛠️ Tech Used  

- **Machine Learning:** TensorFlow / Keras  
- **Backend:** Node.js + Express  
- **Frontend:** React (with modern UI styling)  
- **Deployment Ready:** Can be hosted on Netlify, Vercel, or Heroku  

---

## 🚀 Getting Started  

### 1️⃣ Clone the repo  
```bash
git clone https://github.com/abdulah-x/Traffic-sign-recognition.git
cd Traffic-sign-recognition
````

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

Runs on: **[http://localhost:5000](http://localhost:5000)**

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

Runs on: **[http://localhost:3000](http://localhost:3000)**

Now open the frontend in your browser → upload a traffic sign image → see the prediction 🚀

---

## 🎯 Who can use this?

* 🧑‍💻 **Developers** → to learn full-stack ML deployment
* 🧑‍🏫 **Students** → to showcase ML + Web Dev projects
* 🚘 **Car enthusiasts** → to understand how AI in vehicles works
* 👩‍👩‍👦 **Non-technical users** → just upload an image and see results!

---

## 🌍 Deployment

* **Frontend:** Host on **Netlify / Vercel**
* **Backend:** Deploy on **Heroku / Render**
* Make sure to update API URLs in the frontend before deploying.
