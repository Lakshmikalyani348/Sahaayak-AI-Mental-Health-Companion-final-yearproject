import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from safety import is_harmful, get_helpline_message
from model import detect_emotion, detect_intent
from dotenv import load_dotenv

# Step 1: Check API Key Configuration
# Load environment variables from the .env file in the root directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

app = Flask(__name__, static_folder="../frontend", template_folder="../frontend", static_url_path="")
CORS(app)

# Diagnostics
api_key = os.getenv("GROQ_API_KEY")
if api_key:
    print(f"--- Groq API Key Verification: SUCCESS ---")
else:
    print("--- Groq API Key Verification: FAILED (Check your .env file) ---")

# Step 2: Initialize Groq Client
client = Groq(api_key=api_key)

@app.route("/")
def index():
    """Serve the frontend index.html"""
    return app.send_static_file("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    """
    Chatbot API using the Correct Message Format
    """
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"response": "Please enter a message."})

    # Basic Safety Check
    if is_harmful(user_message):
        return jsonify({"response": get_helpline_message(), "safety_trigger": True})

    # Emotion Detection
    emotion = detect_emotion(user_message)

    # Intent Detection
    intent = detect_intent(user_message)
    
    # Get conversation history from request
    history = data.get("history", [])
    
    # Step 3: API call with Context and System Instructions
    # Limit history to last 10 messages for token efficiency and relevance
    limited_history = history[-10:] if history else []
    
    system_content = f"""
    You are 'Sahaayak', an empathetic and professional AI Mental Health Assistant.
    Your personality: Warm, supportive, non-judgmental, and human-like.
    Detected User Emotion: {emotion}
    Detected Query Type: {intent}
    
    Guidelines:
    1. Respond in the language used by the user (English or Telugu). 
    2. If the user is English-speaking, use supportive English. 
    3. If the user uses Telugu, use comforting Telugu (Unicode).
    4. For 'mental_health' intent: Be an empathetic listener. Ask open-ended questions.
    5. For 'physical_health' intent: Remind the user you are an AI emotional support companion, not a doctor. Suggest consulting a medical professional for physical ailments like {user_message}.
    6. Always prioritize user safety.
    7. Keep responses concise and conversational.
    """

    messages = [{"role": "system", "content": system_content}]
    
    # Add history
    for msg in limited_history:
        messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
    
    # Add current message
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=600
        )
        
        # Extract and return response
        reply = response.choices[0].message.content
        return jsonify({
            "response": reply,
            "emotion": emotion,
            "intent": intent,
            "success": True
        })

    except Exception as e:
        # Step 4: Improve Error Handling
        print(f"Error: {e}")
        return jsonify({
            "response": f"Error occurred. Please try again. Details: {str(e)}",
            "emotion": emotion,
            "success": False
        })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
