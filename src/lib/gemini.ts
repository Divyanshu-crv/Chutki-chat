import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is missing. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function getAiResponse(prompt: string, useThinking: boolean = false) {
  if (!apiKey) return "AI is not configured. Please add your GEMINI_API_KEY in the Secrets panel.";

  const model = useThinking ? "gemini-3.1-pro-preview" : "gemini-3.1-flash-lite-preview";
  
  const config: any = {
    systemInstruction: "You are a helpful, friendly chat assistant. Keep responses concise and engaging. If thinking mode is enabled, provide a more detailed and reasoned response.",
  };

  if (useThinking) {
    config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while generating a response.";
  }
}
