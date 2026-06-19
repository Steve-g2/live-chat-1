import { readFile, writeFile } from 'fs/promises';
export async function saveChatHistory(chatData) {
    await writeFile('chat_history.json', JSON.stringify(chatData, null, 2))
}

export async function loadChatHistory() {
    try {
    const rawData = await readFile('chat_history.json', 'utf-8');
    return JSON.parse(rawData);
    } catch(err){
        if (err.code === 'ENOENT') {
            console.log('chat_history.json does not exist. Fresh start');
            return null;
        } else {
            throw err;
        }
    }
}