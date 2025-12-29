const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve your HTML/CSS/JS files
app.use(express.static(path.join(__dirname)));

let waitingUser = null;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('find_stranger', () => {
        if (waitingUser) {
            // Match found!
            const stranger = waitingUser;
            waitingUser = null;

            const roomID = `room_${socket.id}_${stranger.id}`;
            socket.join(roomID);
            stranger.join(roomID);

            io.to(roomID).emit('stranger_found', roomID);

            socket.roomID = roomID;
            stranger.roomID = roomID;
        } else {
            // No one waiting, you are now in line
            waitingUser = socket;
            socket.emit('waiting_for_stranger');
        }
    });

    socket.on('send_message', (msg) => {
        if (socket.roomID) {
            socket.to(socket.roomID).emit('receive_message', msg);
        }
    });

    socket.on('disconnect_request', () => handleDisconnect(socket));
    socket.on('disconnect', () => handleDisconnect(socket));
});

function handleDisconnect(socket) {
    if (waitingUser === socket) waitingUser = null;
    if (socket.roomID) {
        socket.to(socket.roomID).emit('stranger_disconnected');
        socket.leave(socket.roomID);
        socket.roomID = null;
    }
}

const PORT = process.env.PORT || 3000; // Use Render's port, or 3000 if local
server.listen(PORT, () => {
    console.log(`chatMESS server running on port ${PORT}`);

});
