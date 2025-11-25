import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const SYSTEM_INSTRUCTION = `You are Zinec Bot, the customer support assistant for Zinec, a marketplace for assignment services.
Your goal is to help students find the right "Assistant" (formerly referred to as joki) for their needs.
Key Information:
1. Zinec offers a 100% Auto Refund if the deadline is missed.
2. Users can upload files (Word, PDF, JPG, PPTX).
3. We have specialists: Rizky (IT), Dewi (Math), Yoga (Economy), Aldi (Design/DKV).
4. Tone: Friendly, helpful, casual, and encouraging (using Indonesian slang like "kak", "gan", "santuy" is okay but keep it polite).
5. If asked how to order: "Just click on an Assistant in the Dashboard, or upload your file directly."

Always answer in Indonesian unless addressed in English.`;

export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing.");
    return;
  }
  try {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
  }
};

export const sendMessageToGemini = async (message: string, history: ChatMessage[]): Promise<string> => {
  if (!genAI) {
    initializeGemini();
  }

  if (!genAI) {
    return "Error: API Key not configured. Please check your environment variables.";
  }

  try {
    if (!chatSession) {
       chatSession = genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
    }

    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message
    });

    return result.text || "Maaf, saya tidak dapat memproses pesan anda.";

  } catch (error) {
    console.error("Gemini Interaction Error:", error);
    return "Maaf, sistem kami sedang sibuk. Silakan coba lagi nanti.";
  }
};