const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const currentMoodLabel = document.getElementById('current-mood');
const moodHistoryContainer = document.getElementById('mood-history');
const voiceBtn = document.getElementById('voice-btn');
const typingIndicator = document.getElementById('typing-indicator');
const langToggle = document.getElementById('lang-toggle');
const ttsBtn = document.getElementById('tts-btn');
const bookBtn = document.getElementById('book-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const bookingModal = document.getElementById('booking-modal');
const closeModal = document.querySelector('.close-modal');
const bookingForm = document.getElementById('booking-form');

// State Management
let currentLanguage = 'en-US'; // Default
let ttsEnabled = true;

// Fetch chat history from localStorage if it exists
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];

// Initial render
window.onload = () => {
    chatHistory.forEach(msg => {
        // Migration support for old 'text/sender' format or missing 'content'
        const text = msg.content || msg.text || "Empty message";
        const sender = msg.role === 'user' ? 'user' : (msg.sender === 'user' ? 'user' : 'bot');
        renderMessage(text, sender);
    });
    updateMoodHistoryUI();
};

function renderMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    
    const p = document.createElement('p');
    p.innerText = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('time');
    timeSpan.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.appendChild(p);
    messageDiv.appendChild(timeSpan);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessage(text, sender, emotion = null) {
    renderMessage(text, sender);
    
    // Save to history
    chatHistory.push({ role: (sender === 'user' ? 'user' : 'assistant'), content: text });
    if (chatHistory.length > 50) chatHistory.shift(); // Keep last 50
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    if (emotion) {
        moodHistory.push(emotion);
        if (moodHistory.length > 5) moodHistory.shift();
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
        updateMoodHistoryUI();
    }
}

function updateMoodHistoryUI() {
    moodHistoryContainer.innerHTML = '';
    const emojiMap = {
        'joy': '😊', 'sadness': '😢', 'anger': '😠', 
        'fear': '😨', 'love': '❤️', 'surprise': '😯', 'neutral': '😐'
    };
    moodHistory.forEach(emo => {
        const span = document.createElement('span');
        span.classList.add('mood-tag');
        span.innerText = emojiMap[emo.toLowerCase()] || '✨';
        moodHistoryContainer.appendChild(span);
    });
}

// Voice Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.onclick = () => {
        recognition.lang = currentLanguage; // Set to current preference
        recognition.start();
        voiceBtn.classList.add('recording');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        voiceBtn.classList.remove('recording');
    };

    recognition.onerror = () => {
        voiceBtn.classList.remove('recording');
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('recording');
    };
} else {
    voiceBtn.style.display = 'none';
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    userInput.value = '';
    addMessage(message, 'user');
    
    // Show immediate feedback
    currentMoodLabel.innerText = "Current Vibe: Analyzing...";
    typingIndicator.classList.remove('hidden');
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Send history directly from our state
        const historyData = chatHistory.slice(-10).map(m => ({
            role: m.role,
            content: m.content
        }));

        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                history: historyData
            }),
        });

        const data = await response.json();
        typingIndicator.classList.add('hidden');

        if (data && data.response) {
            addMessage(data.response, 'bot', data.emotion);
            if (data.emotion) {
                currentMoodLabel.innerText = `Current Vibe: ${data.emotion.toUpperCase()} ✨`;
            }
            // Speak the response if TTS is enabled
            if (ttsEnabled) {
                speakText(data.response);
            }
        } else {
            const errorMsg = data && data.error ? data.error : "I received an empty response. Please try again.";
            addMessage("⚠️ " + errorMsg, 'bot');
        }
    } catch (error) {
        console.error('Error:', error);
        typingIndicator.classList.add('hidden');
        addMessage("⚠️ I can't reach my brain! Please check if the server is running.", 'bot');
    }
});

// Text-to-Speech Function
function speakText(text) {
    if (!window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
}

// UI Controls Logics
langToggle.onclick = () => {
    const spans = langToggle.querySelectorAll('span');
    if (currentLanguage === 'en-US') {
        currentLanguage = 'te-IN';
        spans[0].classList.remove('active');
        spans[2].classList.add('active');
    } else {
        currentLanguage = 'en-US';
        spans[0].classList.add('active');
        spans[2].classList.remove('active');
    }
};

ttsBtn.onclick = () => {
    ttsEnabled = !ttsEnabled;
    ttsBtn.classList.toggle('active');
    const icon = ttsBtn.querySelector('i');
    icon.className = ttsEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
};

// Modal Operations
bookBtn.onclick = () => bookingModal.classList.remove('hidden');

// New Chat Functionality
newChatBtn.onclick = () => {
    if (confirm("Are you sure you want to start a new chat? Your current history will be cleared.")) {
        clearChat();
    }
};

function clearChat() {
    // Clear Local Storage
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('moodHistory');
    
    // Reset Data Arrays
    chatHistory = [];
    moodHistory = [];
    
    // Clear UI
    chatBox.innerHTML = '';
    
    // Re-initialize with greeting
    renderMessage("Hello. I'm Sahaayak. How are you feeling today? You can share anything with me.", "bot");
    
    // Reset Mood UI
    currentMoodLabel.innerText = "Current Vibe: Detecting...";
    updateMoodHistoryUI();
    
    // Speak greeting if TTS enabled
    if (ttsEnabled) {
        speakText("Hello. I'm Sahaayak. How are you feeling today? You can share anything with me.");
    }
}

closeModal.onclick = () => bookingModal.classList.add('hidden');
window.onclick = (event) => {
    if (event.target == bookingModal) bookingModal.classList.add('hidden');
};

bookingForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('patient-name').value;
    const date = document.getElementById('appointment-date').value;
    const type = document.getElementById('doctor-type').value;
    
    // Simulate booking
    bookingModal.classList.add('hidden');
    addMessage(`📅 Request Sent: Appointment for ${name} (${type}) on ${date}. Sahaayak team will reach out shortly!`, 'bot');
    bookingForm.reset();
};
