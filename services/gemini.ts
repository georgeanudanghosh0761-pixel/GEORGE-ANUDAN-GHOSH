
import { GoogleGenAI, Type } from "@google/genai";
import { QuizScript } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuizScript = async (topic: string): Promise<QuizScript> => {
  const prompt = `
    You are an expert viral content creator for a Quiz YouTube channel. 
    Create a detailed quiz script in Bengali (বাংলা) for the topic: "${topic}".
    Follow this exact high-retention structure:
    1. Super Fast Intro (0-3s): A pattern-interrupt visual description and a shocking text hook. No "Hello".
    2. Informational Hook (3-7s): A challenge script saying 99% fail.
    3. Main Body: 5 highly engaging questions. Each question must have 4 options and 1 correct answer.
    4. Surprise Twist: A "did you know" fact related to the topic that is share-worthy.
    5. Smart CTA: A clever way to ask for likes based on their score.

    Respond ONLY with a JSON object.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          intro: {
            type: Type.OBJECT,
            properties: {
              visualDescription: { type: Type.STRING },
              text: { type: Type.STRING }
            },
            required: ["visualDescription", "text"]
          },
          hook: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
                fact: { type: Type.STRING }
              },
              required: ["question", "options", "answer", "fact"]
            }
          },
          twist: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "description"]
          },
          cta: { type: Type.STRING }
        },
        required: ["topic", "intro", "hook", "questions", "twist", "cta"]
      }
    }
  });

  return JSON.parse(response.text);
};
