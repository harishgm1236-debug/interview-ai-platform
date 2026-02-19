# 🎯 AI Interview Preparation Platform

An advanced AI-powered platform that helps job seekers practice technical interviews with real-time feedback using **Computer Vision**, **NLP**, and **Speech Analysis**.

---

## 🚀 Key Features

### 🤖 AI-Driven Interviews
- Role-based question generation (Frontend, Backend, etc.)
- Resume-based personalized interviews (PDF upload)

### 📹 Multimodal Evaluation
- **Facial Emotion Detection** (DeepFace)
- **Speech Analysis** (WPM + filler words)
- **Text Evaluation** (Relevance, clarity, technical depth)

### 📊 Performance Analytics
- Skill breakdown charts
- Progress tracking
- Downloadable PDF reports

### 🕵️ Smart Proctoring
- Tab switching detection
- Interview integrity monitoring

### 🔐 Admin Panel
- User monitoring
- Platform statistics dashboard

---

## 🛠️ Tech Stack

### 🌐 Frontend (`ai-interview`)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

### 🧠 Backend (`ai-interview-backend`)
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication

### 🤖 AI Service (`ai-interview-ai`)
- Python + FastAPI
- DeepFace (Emotion Detection)
- Librosa (Audio Processing)
- Scikit-Learn (TF-IDF / Cosine Similarity)
- Google Speech Recognition

---

## 📂 Project Structure

interview/
│
├── ai-interview/ # Frontend (Next.js)
├── ai-interview-backend/ # Node.js API
├── ai-interview-ai/ # Python AI Engine
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/harishgm1236-debug/interview.git
cd interview
2️⃣ Setup AI Service (Python)
cd ai-interview-ai
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
3️⃣ Setup Backend (Node.js)
cd ../ai-interview-backend
npm install
Create .env file:

MONGO_URI=mongodb+srv://harish:harish123@cluster0.ebvooua.mongodb.net/ai_interview?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey
Run:

npm run seed   # Optional (Creates Admin)
npm run dev    # Runs on Port 5000
4️⃣ Setup Frontend (Next.js)
cd ../ai-interview
npm install
npm run dev    # Runs on Port 3000
🔑 Default Credentials (After Seeding)
Role	Email	Password
Admin	admin@interviewai.com	admin123456
User	test@interviewai.com	test123456
🏗 Architecture Overview
Frontend → Backend API → AI Engine
Next.js → Express → FastAPI → ML Models

🚀 Future Enhancements
AI-powered adaptive difficulty

Live coding environment

Real-time voice confidence scoring

AI interview simulation with avatar

👨‍💻 Developed By
Harish G M
Full Stack Developer & AI Enthusiast
Building the Future of Recruitment 🚀

