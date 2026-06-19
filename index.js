import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs/promises';
import { saveChatHistory, loadChatHistory } from './chat-history.js';

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let messageId = 1;

const chat = {
    users: [],
    history: []
};

const chatHistory = await loadChatHistory();
if (chatHistory) {
    Object.assign(chat, chatHistory);
}

try {
    const rawData = await readFile('chat_history.json', 'utf-8');
    const parsedChat = JSON.parse(rawData);
    Object.assign(chat, parsedChat);
    messageId = chat.history[chat.history.length - 1].id + 1;
} catch (err) {
    if (err.code === 'ENOENT') {
        console.log('No history file. Start fresh');
    } else {
        throw err;
    }
}


chat.users = [];

app.get('/check-nickname', (req, res) => {
    const nickname = req.query.nickname;
    const exists = chat.users.includes(nickname);
    res.json({ exists });
});

app.post('/join', async (req, res) => {
    const nickname = req.body.nickname;
    chat.users.push(nickname);
    const userJoinMessageId = messageId++;
    chat.history.push({
        id: userJoinMessageId,
        nickname: 'System',
        message: `welcome ${nickname} to the chat`,
        datetime: new Date()
    });
    await saveChatHistory(chat);
    console.log(chat.history.length);
    res.render('chat', { chat, nickname, userJoinMessageId });
});

app.get('/poll', (req, res) => {
    const lastMessageId = Number(req.query.lastMessageId);
    res.status(200).json({
        history: chat.history.filter(his => his.id > lastMessageId)
    })
})

app.post('/send', async (req, res) => {
    const msg = req.body.messageContent;
    const nickname = req.body.nickname;
    console.log(msg, ' ', nickname);
    chat.history.push({
        id: messageId++,
        nickname: nickname,
        message: msg,
        datetime: new Date()
    });
    await writeFile('chat_history.json', JSON.stringify(chat, null, 2));
    res.send('OK');
});


app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
});