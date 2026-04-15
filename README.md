# 🩺 Sahaayak | AI Mental Health Companion

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Framework-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Groq](https://img.shields.io/badge/LLM-Groq_Llama--3.3-orange)](https://groq.com/)
[![Transformers](https://img.shields.io/badge/NLP-Hugging_Face-yellow)](https://huggingface.co/)

**Sahaayak** is an empathetic, professional AI-driven mental health companion designed to provide emotional support and wellness guidance. By combining advanced Large Language Models (LLMs) with real-time emotion detection, Sahaayak offers a supportive space for users to express their feelings in both English and Telugu.

---

## ⚡ Key Features

-   🧠 **Emotion-Aware Conversations**: Uses **DistilBERT** to analyze user sentiment (Joy, Sadness, Anger, etc.) and tailor responses accordingly.
-   🌍 **Multilingual Support**: Seamlessly communicates in **English** and **Telugu**, with automatic language-appropriate responses.
-   🎙️ **Voice & Audio Interaction**: Integrated **Speech-to-Text** (Web Speech API) for hands-free input and **Text-to-Speech** for vocalized responses.
-   🛡️ **Smart Safety Filters**: Real-time detection of harmful or high-risk inputs with immediate crisis resource routing.
-   🩺 **Health Intent Differentiation**: Automatically distinguishes between mental health concerns and physical symptoms, providing appropriate empathetic support or medical disclaimers.
-   📅 **Mock Doctor Booking**: A built-in appointment request system to simulate connection with professional help.
-   📊 **Mood Tracking**: Persistent mood tracking using **Browser LocalStorage** for a personalized wellness journey.
-   ✨ **Glassmorphic UI**: A premium, modern, and soothing user interface optimized for dark mode.

---

## 🗺️ Future Roadmap

- [ ] **Multi-Conversation Management**: Save separate chat sessions and switch between them.
- [ ] **Data Export**: Option to download chat logs for personal reflection.
- [ ] **Enhanced Emotion Analytics**: Visualizing mood trends over weeks/months.
- [ ] **Global Helpline Database**: Expanding the safety router to include region-specific emergency numbers.

---

## 🛠️ Technology Stack

| Layer | Key Technologies |
| :--- | :--- |
| **Backend** | Python, Flask, Flask-CORS |
| **AI/LLM** | Groq API (Llama-3.3-70b-versatile) |
| **NLP** | DistilBERT (Emotion), Transformers, Torch |
| **Frontend** | HTML5, CSS3, Vanilla JS, Web Speech API |
| **Persistence** | Browser LocalStorage |
| **Environment** | python-dotenv |

---

## 📂 Project Structure

```bash
health-care-chatbot/
├── backend/
│   ├── app.py           # Main Flask application
│   ├── model.py         # AI Model logic (Emotion & Intent detection)
│   └── safety.py        # Safety filters & crisis management
├── frontend/
│   ├── index.html       # UI Structure
│   ├── style.css        # Premium styling
│   └── script.js        # Frontend interactions & API calls
├── .env                 # API Keys (Local Only)
├── Procfile             # Deployment config
└── requirements.txt     # Python dependencies
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8 or higher installed on your system.
- A **Groq Cloud API Key** (Get one at [groq.com](https://console.groq.com/)).

### 2. Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/health-care-chatbot.git
    cd health-care-chatbot
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory and add your Groq API Key:
    ```env
    GROQ_API_KEY=your_actual_api_key_here
    ```

4.  **Run the Application**:
    ```bash
    python backend/app.py
    ```
    The application will be available at `http://127.0.0.1:5000`.

---

## ⚠️ Disclaimer

Sahaayak is an AI companion for emotional support, **not** a professional medical tool. It does not provide medical diagnosis or treatment. Always consult a licensed healthcare professional for any medical or psychological conditions. In case of immediate danger, please reach out to local emergency services or a crisis helpline.

---

**Developed with ❤️ by Lakshmi kalyani.**
