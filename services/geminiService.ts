
import { GoogleGenAI, Type } from "@google/genai";
import { Sentiment } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

/**
 * Initializes the GoogleGenAI client.
 * Assumes process.env.API_KEY is available in the environment.
 */
const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeSentiment = async (text: string): Promise<Sentiment> => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: `Analise o sentimento do seguinte texto. Responda APENAS com um objeto JSON no formato {"sentiment": "Sentimento"}, onde "Sentimento" pode ser 'Positivo', 'Negativo' ou 'Neutro'. Se o sentimento for ambíguo ou não puder ser determinado, responda com 'Neutro'.
      
      Texto para análise:
      \`\`\`
      ${text}
      \`\`\``,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             sentiment: {
               type: Type.STRING,
               enum: ["Positivo", "Negativo", "Neutro"],
               description: 'O sentimento do texto.',
             },
           },
           required: ["sentiment"],
        },
        temperature: 0.2, // Manter a temperatura baixa para classificação de sentimento consistente
      },
    });

    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);
    
    const sentiment = result.sentiment;

    if (Object.values(Sentiment).includes(sentiment as Sentiment)) {
      return sentiment as Sentiment;
    }
    return Sentiment.NEUTRAL;

  } catch (error) {
    console.error('Erro ao analisar sentimento com a API Gemini:', error);
    // Fallback gracioso em caso de erro da API
    return Sentiment.UNCLASSIFIED;
  }
};