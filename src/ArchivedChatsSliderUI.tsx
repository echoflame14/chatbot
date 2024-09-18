import React from 'react';
import styled from 'styled-components';
import { Message, ArchivedChat } from './types';

// Styled components
const ToggleButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 100;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SliderContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? '0' : '-300px')};
  width: 300px;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 99;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 15px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-weight: bold;
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const ChatItem = styled.div<{ $active: boolean }>`
  padding: 15px;
  background-color: ${({ $active }) => ($active ? '#f1f1f1' : 'white')};
  border-bottom: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const SaveButton = styled.button`
  margin: 10px;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

interface ArchivedChatsSliderUIProps {
  archivedChats: ArchivedChat[];
  onSelectChat: (chatId: string) => void;
  onSaveChat: (title: string, messages: Message[]) => Promise<void>;
  activeChatId: string | null;
  $isOpen: boolean;
  onToggle: () => void;
  fetchArchivedChats: () => Promise<void>;
}


const ArchivedChatsSliderUI: React.FC<ArchivedChatsSliderUIProps> = ({
  archivedChats,
  onSelectChat,
  onSaveChat,
  activeChatId,
  $isOpen,
  onToggle,
  fetchArchivedChats,
}) => {
  // Placeholder for the active chat's messages
  const [currentMessages, setCurrentMessages] = React.useState<Message[]>([]);

  const handleChatClick = (id: string) => {
    console.log(`Chat clicked: ${id}`);
    onSelectChat(id); // Make sure this function updates the active chat ID
  };

  React.useEffect(() => {
    if (activeChatId) {
      // Load messages for the selected chat
      fetchChatMessages(activeChatId);
    }
  }, [activeChatId]);

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/chat/${chatId}`);
      const data = await response.json();
      console.log('Fetched messages:', data.messages); // Debugging line
      setCurrentMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
    }
  };

  const handleSaveChat = async () => {
    const title = prompt('Enter a title for the chat:');
    if (title) {
      try {
        await onSaveChat(title, currentMessages); // Save current messages
        await fetchArchivedChats(); // Refresh chat list
        alert('Chat saved and list updated successfully!');
      } catch (error) {
        console.error('Failed to save chat:', error);
        alert('Failed to save chat. Please try again.');
      }
    } else {
      alert('Chat title is required.');
    }
  };

  return (
    <SliderContainer $isOpen={$isOpen}>
      <Header>Archived Chats</Header>
      <ChatList>
        {archivedChats.map(chat => (
          <ChatItem
            key={chat.id}
            $active={chat.id === activeChatId}
            onClick={() => handleChatClick(chat.id)}
          >
            {chat.title}
          </ChatItem>
        ))}
      </ChatList>
      <SaveButton onClick={handleSaveChat}>Save Current Chat</SaveButton>
      <ToggleButton onClick={onToggle}>
        {$isOpen ? 'Close' : 'Open'} Archive
      </ToggleButton>
    </SliderContainer>
  );
};

export default ArchivedChatsSliderUI;
