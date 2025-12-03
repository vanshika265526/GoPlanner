import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    tripName: { type: Type.STRING, description: "A catchy name for the trip" },
    destination: { type: Type.STRING },
    summary: { type: Type.STRING, description: "A brief summary of the entire trip experience" },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING, description: "Main theme of the day, e.g., 'Historical Tour' or 'Beach Day'" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING, description: "e.g., '09:00 AM' or 'Morning'" },
                activity: { type: Type.STRING, description: "Title of the activity" },
                description: { type: Type.STRING, description: "Details about what to do" },
                location: { type: Type.STRING, description: "Name of the place" },
                type: { 
                  type: Type.STRING, 
                  enum: ['food', 'sightseeing', 'relaxation', 'adventure', 'transport'],
                  description: "Category of the activity"
                }
              },
              required: ["time", "activity", "description", "location", "type"]
            }
          }
        },
        required: ["dayNumber", "theme", "activities"]
      }
    }
  },
  required: ["tripName", "destination", "summary", "days"]
};

export const generateItinerary = async (formData) => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY.");
  }

  const prompt = `
    Create a detailed ${formData.duration}-day travel itinerary for a trip to ${formData.destination}.
    
    Preferences:
    - Budget: ${formData.budget}
    - Interests: ${formData.interests.length > 0 ? formData.interests.join(", ") : "General sightseeing"}
    
    Ensure the itinerary is logical, grouping nearby activities together. 
    Include specific restaurant recommendations for meals.
    The response must be valid JSON matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};