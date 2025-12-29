const socket = io();

const chatWindow = document.getElementById('chat-window');
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-btn');
const disconnectBtn = document.getElementById('disconnect-btn');

let isConnected = false;

// START: Connect immediately
window.onload = () => {
    findStranger();
};

function findStranger() {
    chatWindow.innerHTML = '';
    addSystemMessage("Connecting to server...");
    socket.emit('find_stranger');
    
    disconnectBtn.innerText = "Stop";
    disconnectBtn.classList.remove('new');
    enableInput(false);
}

// LISTEN: What does the server say?
socket.on('waiting_for_stranger', () => {
    addSystemMessage("Looking for someone you can vibe with... (Waiting)");
});

socket.on('stranger_found', () => {
    isConnected = true;
    addSystemMessage("Stranger found! Say hi!");
    enableInput(true);
});

socket.on('receive_message', (msg) => {
    addMessage("Stranger: " + msg, 'stranger');
});

socket.on('stranger_disconnected', () => {
    isConnected = false;
    addSystemMessage("Stranger has disconnected.");
    endChatUI();
});

// ACTION: Send message to server
function sendMessage() {
    const text = msgInput.value.trim();
    if (text && isConnected) {
        addMessage("You: " + text, 'you');
        socket.emit('send_message', text);
        msgInput.value = '';
    }
}

function disconnect() {
    if (isConnected || disconnectBtn.innerText === "Stop") {
        socket.emit('disconnect_request');
        isConnected = false;
        addSystemMessage("You disconnected.");
        endChatUI();
    } else {
        findStranger();
    }
}

function endChatUI() {
    disconnectBtn.innerText = "New";
    disconnectBtn.classList.add('new');
    enableInput(false);
}

// UI Helpers
function addMessage(text, className) {
    const div = document.createElement('div');
    div.classList.add('message', className);
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addSystemMessage(text) {
    const div = document.createElement('div');
    div.classList.add('system-message');
    div.innerText = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function enableInput(status) {
    msgInput.disabled = !status;
    sendBtn.disabled = !status;
    if (status) msgInput.focus();
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
disconnectBtn.addEventListener('click', disconnect);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') disconnect(); });
