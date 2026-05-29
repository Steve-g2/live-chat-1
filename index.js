import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


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
}

app.post('/join', (req, res) => {
    const nickname = req.body.nickname;
    chat.users.push(nickname);
    const userJoinMessageId = messageId++;
    chat.history.push({
        id: userJoinMessageId,
        nickname: 'System',
        message: `welcome ${nickname} to the chat`,
        datetime: new Date()
    });
    console.log(chat.history.length);
    res.render('chat', { chat, nickname, userJoinMessageId });
});

app.get('/poll', (req, res) => {
    const lastMessageId = Number(req.query.lastMessageId);
    console.log('polling messages greater than', lastMessageId);
    res.status(200).json({
        history: chat.history.filter(his => his.id > lastMessageId)
    })
})

app.post('/send', (req, res) => {
    const msg = req.body.messageContent;
    const nickname = req.body.nickname;
    console.log(msg, ' ', nickname);
    chat.history.push({
        id: messageId++,
        nickname: nickname,
        message: msg,
        datetime: new Date()
    });
    res.send('OK');
});


app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
});