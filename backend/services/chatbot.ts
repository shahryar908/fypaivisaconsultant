// src/backend/services/chatbot.ts
import GroqClient  from 'groq-sdk';
import { SYSTEM_PROMPT } from '../prompts/visa_prompt';
import dotenv from 'dotenv';
dotenv.config()
// Initialize Groq client
const groq = new GroqClient({
  apiKey: process.env.GROQ_API_KEY || ''
});

// Main function to generate chat response
export async function generateChatResponse(message: string): Promise<string> {
  try {
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 1000
    });
    
    return completion.choices[0].message.content || 
      "I apologize, but I couldn't generate a response. Please try again.";
      
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}