import OpenAI from 'openai';
import { Message } from '../types'; // Import types from types.ts

// Access the API key from environment variables
const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('The OPENAI_API_KEY environment variable is missing or empty.');
}

// Initialize OpenAI client with the API key
const client = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Use with caution in production environments
});

const chatHistory: Message[] = [
  { content: "You are a helpful assistant.", role: "user" }
];

export const getAIResponse = async (prompt: string): Promise<string> => {
  console.log("Sending request to OpenAI API with prompt:", prompt);

  const userMessage: Message = {
    content: prompt,
    role: "user"
  };
  chatHistory.push(userMessage);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: chatHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant", // Adjust role to role
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 8000,
    });

    console.log("Received response from OpenAI API:", response);

    if (response.choices && response.choices.length > 0 && response.choices[0].message) {
      const aiResponseContent = response.choices[0].message.content || "Sorry, I couldn't generate a response.";

      const aiMessage: Message = {
        content: aiResponseContent,
        role: "assistant"
      };
      chatHistory.push(aiMessage);

      return aiResponseContent;
    } else {
      console.error("Unexpected response structure:", response);
      return "Sorry, I received an unexpected response structure.";
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return "An unknown error occurred";
    }
  }
};
