import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.form`
  display: flex;
  gap: 10px;
`;

const StyledTextarea = styled.textarea`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <InputContainer onSubmit={handleSubmit}>
      <StyledTextarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        rows={3} // You can adjust the number of rows as needed
      />
      <SendButton type="submit">Send</SendButton>
    </InputContainer>
  );
};

export default ChatInput;
