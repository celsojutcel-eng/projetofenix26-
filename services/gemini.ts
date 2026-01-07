
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyContent = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma frase curta (max 15 palavras) de renascimento feminino e uma pergunta profunda de reflexão para o dia de hoje. Foco em mulheres 35+ anos.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            phrase: { type: Type.STRING },
            question: { type: Type.STRING }
          },
          required: ["phrase", "question"]
        },
        systemInstruction: "Você é uma mentora sábia. Use Português do Brasil."
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating daily content:", error);
    return {
      phrase: "A renovação acontece no seu próprio ritmo, um dia de cada vez.",
      question: "Qual parte de você está pronta para florescer hoje?"
    };
  }
};

export const generateWritingInsight = async (text: string) => {
  if (!text || text.length < 50) return null;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise este desabafo terapêutico e ofereça uma palavra de encorajamento profunda (max 2 frases): "${text}"`,
      config: { 
        systemInstruction: "Você é uma terapeuta integrativa gentil. Português do Brasil." 
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating writing insight:", error);
    return null;
  }
};
