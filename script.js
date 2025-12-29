const chatWindow = document.getElementById('chat-window');
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');
const disconnectBtn = document.getElementById('disconnect-btn');

let isConnected = false;
let isStrangerTyping = false;

// Random replies to simulate a stranger
const strangerReplies = [
    "hey", "asl?", "im from mars", "vibecoding?", 
    "cool website lol", "what is this?", "hello from the other side",
    "java is cool but have you tried python?", "brb cat on keyboard",
    "why is it called chatMESS?"
];

// Start the app automatically
window.onload = () => {
    findStranger();
};

function findStranger() {
    addSystemMessage("Looking for someone you can vibe with...");
    disconnectBtn.innerText = "Stop";
    disconnectBtn.classList.remove('new');
    
    // Simulate connection delay
    setTimeout(() => {
        isConnected = true;
        addSystemMessage("Stranger found! Say hi!");
        enableInput(true);
    }, 1500);
}

function disconnect() {
    if (isConnected) {
        isConnected = false;
        addSystemMessage("Stranger has disconnected.");
        disconnectBtn.innerText = "New";
        disconnectBtn.classList.add('new');
        enableInput(false);
    } else {
        // Start new chat
        chatWindow.innerHTML = ''; // Clear chat
        findStranger();
    }
}

function sendMessage() {
    const text = msgInput.value.trim();
    if (text && isConnected) {
        addMessage("You: " + text, 'you');
        msgInput.value = '';
        
        // Simulate stranger reply
        if (!isStrangerTyping) {
            isStrangerTyping = true;
            const delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 sec delay
            setTimeout(() => {
                if(isConnected) { // Check if still connected
                    const randomReply = strangerReplies[Math.floor(Math.random() * strangerReplies.length)];
                    addMessage("Stranger: " + randomReply, 'stranger');
                    isStrangerTyping = false;
                }
            }, delay);
        }
    }
}

// UI Helpers
function addMessage(text, className) {
    const div = document.createElement('div');
    div.classList.add('message', className);
    div.innerText = text;
    chatWindow.appendChild(div);
    scrollToBottom();
}

function addSystemMessage(text) {
    const div = document.createElement('div');
    div.classList.add('system-message');
    div.innerText = text;
    chatWindow.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function enableInput(status) {
    msgInput.disabled = !status;
    sendBtn.disabled = !status;
    if (status) msgInput.focus();
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

disconnectBtn.addEventListener('click', disconnect);

// Allow ESC key to disconnect/new chat
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') disconnect();
});