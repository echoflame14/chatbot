// Defines the structure of a message
export interface Message {
    role: 'system' | 'user' | 'assistant'; // Defines the role of the message sender
    content: string; // The content of the message
  }
  
  // Defines the structure of an archived chat
  export interface ArchivedChat {
    id: string; // Unique identifier for the chat
    title: string; // Title of the chat
    lastMessage: string; // The last message in the chat
    messages: Message[]; // Array of messages in the chat
  }
  
  // Defines the structure of an API response
  export interface ApiResponse {
    choices: Array<{
      finish_reason: 'stop' | 'length' | 'function_call' | 'content_filter' | 'null'; // Reason for the end of the message
      index: number; // Index of the choice
      message: {
        content: string; // The response content from the model
        role: 'assistant'; // Role of the message sender in the response
      };
      logprobs: any; // Optional, depending on model usage
    }>;
    created: number; // Timestamp of when the response was created
    id: string; // Unique ID of the response
    model: string; // Model used for the response
    object: 'chat.completion'; // Type of the object
    usage: {
      completion_tokens: number; // Tokens used in the completion
      prompt_tokens: number; // Tokens used in the prompt
      total_tokens: number; // Total tokens used
      completion_tokens_details?: {
        reasoning_tokens: number; // Optional detailed breakdown
      };
    };
  }
  