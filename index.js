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



const chat = {
    users: [],
    history: []
}

app.post('/join', (req, res) => {
    const nickname = req.body.nickname;
    chat.users.push(nickname);
    chat.history.push({
        nickname: 'system',
        message: `welcome ${nickname} to join the chat`,
        datetime: new Date()
    });
    console.log(chat.history.length);
    res.render('chat', { chat, nickname });
});

app.get('/poll', (req, res) => {
    res.send(JSON.stringify(chat));
});

app.post('/send', (req, res) => {
    const msg = req.body.messageContent;
    const nickname = req.body.nickname;
    console.log(msg, ' ', nickname);
    chat.history.push({
        nickname: nickname,
        message: msg,
        datetime: new Date()
    });
    res.send('OK');
});


app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
});