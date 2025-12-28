
import { GoogleGenAI } from "@google/genai";

export async function* streamChat(
  prompt: string, 
  history: { role: 'user' | 'model', parts: string }[], 
  systemInstruction?: string
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Model version updated to gemini-3-flash-preview
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }]
    })),
  });

  const result = await chat.sendMessageStream({ message: prompt });
  for await (const chunk of result) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
