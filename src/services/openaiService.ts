import OpenAI from 'openai';

// Access the API key from environment variables
const apiKey = import.meta.env.VITE_REACT_APP_OPENAI_API_KEY;

// Initialize OpenAI client with the API key
const client = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: Use with caution
});

export const getAIResponse = async (content: string): Promise<string> => {
  try {
    // Call the OpenAI API to get the response
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content }],
      temperature: 0.7,
      max_tokens: 150,
    });

    // Extract and return the AI response
    return response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response');
  }
};
