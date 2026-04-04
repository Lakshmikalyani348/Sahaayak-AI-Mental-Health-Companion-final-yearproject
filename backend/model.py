from transformers import pipeline

# Load the emotion detection pipeline
print("--- Loading Emotion Detection Model (First-time download may take a minute) ---")
emotion_pipeline = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion", top_k=1)
print("--- Model Loaded Successfully ---")

def detect_emotion(text):
    """
    Detects the emotion from the user's text.
    Returns: 'joy', 'sadness', 'anger', 'fear', 'love', 'surprise', or 'neutral'
    """
    try:
        results = emotion_pipeline(text)
        if results and results[0]:
            # The model returns a list of dictionaries with 'label' and 'score'
            emotion = results[0][0]['label']
            return emotion
    except Exception as e:
        print(f"Error in emotion detection: {e}")
        return "neutral"
    return "neutral"
def detect_intent(text):
    """
    Identifies whether the query is mental health or physical health related.
    """
    physical_keywords = ["fever", "pain", "headache", "cough", "cold", "stomach", "dizzy", "infection", "doctor", "medicine", "pill", "pregnant", "vomit", "nausea"]
    text = text.lower()
    
    if any(word in text for word in physical_keywords):
        return "physical_health"
    return "mental_health"
