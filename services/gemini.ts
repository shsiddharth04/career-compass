import { GoogleGenAI } from "@google/genai";
import { CareerPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const generateCareerPaths = async (
  currentRole: string,
  yearsExperience: number,
  skills: string,
  interests: string[],
  desiredRoles: string[]
): Promise<string> => {
  try {
    const prompt = `
      You are a career advisor. Based on the user’s current role, experience, skills, interests, and desired roles, 
      generate 3 clear career path recommendations. 

      User Profile:
      - Current Role: ${currentRole}
      - Years of Experience: ${yearsExperience}
      - Skills: ${skills}
      - Interests: ${interests.join(', ')}
      - Desired Roles: ${desiredRoles.join(', ')}

      For each path, include:
      1. A 2–4 word title
      2. A 2–3 sentence explanation
      3. 3 next steps
      4. 3 recommended online courses

      Return everything as plain text suitable for a markdown viewer or pre-formatted text block.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "No suggestions available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating career paths. Please check your API key or try again later.";
  }
};

export const recommendCourses = async (
  skills: string,
  desiredRoles: string[]
): Promise<string> => {
  try {
    const prompt = `
      Recommend 6 online courses based on the user's current skills and desired roles.
      
      User Profile:
      - Current Skills: ${skills}
      - Desired Roles: ${desiredRoles.join(', ')}

      Group into:
      - Short-term (1–4 weeks)
      - Long-term (2+ months)

      Output as plain text.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "No course recommendations available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error recommending courses. Please check your API key or try again later.";
  }
};