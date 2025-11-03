
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const { v4: uuidv4 } = require('uuid'); 


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const chats = [];

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create-chat', (req, res) => {
    const sender = req.body.sender;
    console.log(sender);
    const chatId = uuidv4();
    chats.append(chatId);
    res.json({chatId, sender})
});

app.get('/chat/:chatId', (req, res) => {
    const chatId = req.params.chatId;
    const sender = req.query.sender || "Anonymous";
    res.render('chat', { chatId,sender });
});


io.on('connection', (socket) => {
    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
    });

    socket.on('sendMessage', ({ chatId, sender, text }) => {
        const message = { sender, text, timestamp: new Date() };
        io.to(chatId).emit('receiveMessage', message);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));


