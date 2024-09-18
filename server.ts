import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const conversations = new Map();

app.get('/archived-chats', (req, res) => {
  const chats = Array.from(conversations.values()).map(({ id, title }) => ({ id, title }));
  res.json(chats);
});

app.get('/chat/:id', (req, res) => {
  const { id } = req.params;
  const chat = conversations.get(id);
  if (chat) {
    res.json(chat);
  } else {
    res.status(404).send('Chat not found');
  }
});

app.post('/save-chat', (req, res) => {
  const { id, title, messages } = req.body;
  const chatId = id || uuidv4();
  conversations.set(chatId, { id: chatId, title, messages });
  res.status(200).send('Chat saved');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));