import React, { useEffect } from 'react';
import styled from 'styled-components';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import ArchivedChatsSlider from './ArchivedChatsSlider';
import useChatStore from '../store/ChatStore';

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
  const { messages, sendMessage, fetchArchivedChats } = useChatStore();

  useEffect(() => {
    fetchArchivedChats();
  }, [fetchArchivedChats]);

  return (
    <AppContainer>
      <ChatHistory messages={messages} />
      <ChatInput onSendMessage={sendMessage} />
      <ArchivedChatsSlider />
    </AppContainer>
  );
};

export default App;