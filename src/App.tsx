import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { Message, ArchivedChat } from './types';
import ArchivedChatsSliderUI from './ArchivedChatsSliderUI';
import axios from 'axios';
import { getAIResponse } from './services/apiService';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
`;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [archivedChats, setArchivedChats] = useState<ArchivedChat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await axios.get<ArchivedChat[]>('http://localhost:3001/archived-chats');
        setArchivedChats(response.data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) {
      const newChatId = `chat-${Date.now()}`; // Generate a unique ID for the new chat
      const newChatTitle = `Chat ${newChatId}`; // Define a title for the new chat
      
      try {
        // Initialize the new chat with an empty message list
        await axios.post('http://localhost:3001/save-chat', {
          title: newChatTitle,
          messages: [] // Start with an empty message list
        });
  
        // Select the new chat
        setSelectedChatId(newChatId);
        setMessages([]); // Clear existing messages as we're starting a new chat
      } catch (error) {
        console.error("Failed to create new chat:", error);
        return;
      }
    }
  
    // Proceed with sending the message for the selected chat
    const newMessage: Message = { content, role: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    try {
      // Use the apiService to get AI response
      const aiResponse = await getAIResponse(content);
      const aiMessage: Message = {
        content: aiResponse,
        role: 'assistant'
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        content: error instanceof Error ? `Error: ${error.message}` : "An unknown error occurred",
        role: 'assistant'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  
  const handleSelectChat = (chatId: string) => {
    console.log(`Selected chat ID: ${chatId}`);
    setSelectedChatId(chatId);
  };

 
  const handleSaveChat = async (title: string, messages: Message[]): Promise<void> => {
    if (!title || messages.length === 0) {
      console.error("Cannot save chat. Title or messages are missing.");
      return;
    }

    try {
      await axios.post('http://localhost:3001/save-chat', { title, messages });
      console.log(`Chat '${title}' saved successfully.`);

      // Reload conversations after saving
      const archivedChatsResponse = await axios.get<ArchivedChat[]>('http://localhost:3001/archived-chats');
      setArchivedChats(archivedChatsResponse.data);
    } catch (error) {
      console.error("Failed to save chat:", error);
    }
  };

  const handleToggleSlider = () => {
    setIsSliderOpen(prev => !prev);
  };

  return (
    <AppContainer>
      <ChatHistory messages={messages} ref={chatHistoryRef} />
      <ChatInput onSendMessage={handleSendMessage} />
      <ArchivedChatsSliderUI
        archivedChats={archivedChats}
        onSelectChat={handleSelectChat}
        onSaveChat={handleSaveChat}
        activeChatId={selectedChatId} // Pass the active chat ID
        $isOpen={isSliderOpen}
        onToggle={handleToggleSlider}
        fetchArchivedChats={async () => {
          try {
            const response = await axios.get<ArchivedChat[]>('http://localhost:3001/archived-chats');
            setArchivedChats(response.data);
          } catch (error) {
            console.error("Failed to fetch archived chats:", error);
          }
        }}
      />
    </AppContainer>
  );
};

export default App;
