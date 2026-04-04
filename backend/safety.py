def is_harmful(text):
    """
    Detects harmful or suicidal words in the text.
    Returns True if harmful, False otherwise.
    """
    harmful_words = [
        "suicide", "kill myself", "die", "harm myself", "end my life",
        "don't want to live", "better off dead", "cutting myself", "self-harm",
        "want to disappear", "hurt myself", "take my life", "jump off",
        "pill overdose", "never wake up", "give up on life", "no point in living"
    ]
    
    text = text.lower()
    for word in harmful_words:
        if word in text:
            return True
    return False

def get_helpline_message():
    """
    Returns a standard helpline message for crisis situations.
    """
    return (
        "I'm very concerned about what you're sharing. Please know that you're not alone, "
        "and there's help available. You can reach out to a crisis helpline: "
        "National Suicide Prevention Lifeline: 988 (USA), "
        "Aasra: +91-9820466726 (India). "
        "Please talk to a trusted friend, family member, or healthcare professional immediately."
    )
