import React from 'react';
import styled from 'styled-components';
import { Message } from '../store/ChatStore';

const ChatHistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const MessageBubble = styled.div<{ role: Message['role'] }>`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 20px;
  margin-bottom: 10px;
  background-color: ${({ role }) => {
    switch (role) {
      case 'user':
        return '#007bff';
      case 'assistant':
        return '#28a745';
      case 'system':
        return '#6c757d';
      default:
        return '#ffffff';
    }
  }};
  color: white;
  align-self: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 100%;
`;

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  return (
    <ChatHistoryContainer>
      {messages.map((message, index) => (
        <MessageBubble key={index} role={message.role}>
          <pre style={{ margin: 0 }}>
            {message.content}
          </pre>
        </MessageBubble>
      ))}
    </ChatHistoryContainer>
  );
};

export default ChatHistory;
