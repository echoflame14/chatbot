import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { getAIResponse } from '../services/openaiService';

type Message = {
  content: string;
  role: 'user' | 'assistant' | 'system';
};

type ArchivedChat = {
  id: string;
  title: string;
};

type ChatStore = {
  messages: Message[];
  archivedChats: ArchivedChat[];
  activeChatId: string | null;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setArchivedChats: (chats: ArchivedChat[]) => void;
  setActiveChatId: (id: string | null) => void;
  fetchArchivedChats: () => Promise<void>;
  fetchChatMessages: (chatId: string) => Promise<void>;
  saveChat: (title: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
};

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      archivedChats: [],
      activeChatId: null,
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      setArchivedChats: (chats) => set({ archivedChats: chats }),
      setActiveChatId: (id) => set({ activeChatId: id }),
      fetchArchivedChats: async () => {
        try {
          const response = await axios.get<ArchivedChat[]>('http://localhost:3001/archived-chats');
          set({ archivedChats: response.data });
        } catch (error) {
          console.error("Failed to fetch archived chats:", error);
        }
      },
      fetchChatMessages: async (chatId) => {
        try {
          const response = await axios.get<{ messages: Message[] }>(`http://localhost:3001/chat/${chatId}`);
          set({ messages: response.data.messages, activeChatId: chatId });
        } catch (error) {
          console.error("Failed to fetch chat messages:", error);
        }
      },
      saveChat: async (title) => {
        const { messages, activeChatId } = get();
        try {
          await axios.post('http://localhost:3001/save-chat', { id: activeChatId, title, messages });
          await get().fetchArchivedChats();
        } catch (error) {
          console.error("Failed to save chat:", error);
        }
      },
      sendMessage: async (content) => {
        const userMessage: Message = { content, role: 'user' };
        get().addMessage(userMessage);
        try {
          const aiResponseContent = await getAIResponse(content);
          const assistantMessage: Message = { content: aiResponseContent, role: 'assistant' };
          get().addMessage(assistantMessage);
        } catch (error) {
          console.error("Failed to get AI response:", error);
          get().addMessage({ content: "Sorry, I couldn't generate a response.", role: 'assistant' });
        }
      },
    }),
    {
      name: 'chat-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useChatStore;