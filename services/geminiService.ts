
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set. AI features will fail.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateStoryContinuation = async (
  currentContent: string,
  instruction: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: API Key missing.";

  try {
    // Fixed: Using gemini-3-flash-preview for text generation tasks.
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are a co-author assisting a novelist.
      
      Context (The story so far):
      ${currentContent.slice(-2000)} 
      
      Instruction:
      ${instruction}

      Continue the story or perform the requested action. maintain the tone and style.
      Output only the new content.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate content. Please try again.";
  }
};

export const summarizeChapter = async (content: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Error: API Key missing.";

  try {
    // Fixed: Using gemini-3-flash-preview for summarization tasks.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following novel chapter in 2-3 engaging sentences for a preview:\n\n${content.slice(0, 5000)}`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};
