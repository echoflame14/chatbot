import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getAIResponse = async (content: string): Promise<string> => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content }],
      temperature: 0.7,
      max_tokens: 150,
    });
    return response.choices[0].message.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response');
  }
};