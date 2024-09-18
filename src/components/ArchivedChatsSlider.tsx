import React, { useState } from 'react';
import styled from 'styled-components';
import useChatStore from '../store/ChatStore';

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

const ArchivedChatsSlider: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { archivedChats, activeChatId, fetchChatMessages, saveChat } = useChatStore();

  const handleChatClick = (id: string) => {
    fetchChatMessages(id);
  };

  const handleSaveChat = async () => {
    const title = prompt('Enter a title for the chat:');
    if (title) {
      await saveChat(title);
    }
  };

  return (
    <>
      <SliderContainer $isOpen={isOpen}>
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
      </SliderContainer>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Open'} Archive
      </ToggleButton>
    </>
  );
};

export default ArchivedChatsSlider;