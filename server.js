const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const Message = require('./models/Message');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/group', groupRoutes);
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
    });

    socket.on('sendMessage', async ({ groupId, userId, message }) => {
        try {
            const newMessage = await Message.create({ groupId, sender: userId, text: message });
            io.to(groupId).emit('newMessage', newMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});