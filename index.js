import express from 'express';
import path from 'path';



const app = express();

app.use(express.static('public'));

app.get('/chat', (req, res) => {
    res.send('welcome to chat')
});

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
});