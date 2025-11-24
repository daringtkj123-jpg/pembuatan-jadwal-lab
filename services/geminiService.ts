import { GoogleGenAI, Type } from "@google/genai";
import { Booking, LabId } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIAnalysisResult {
  conflicts: string[];
  suggestions: string[];
  isSafe: boolean;
  optimizedSchedule?: any[];
}

export const analyzeScheduleWithGemini = async (
  bookings: Booking[],
  pendingBooking: Booking
): Promise<AIAnalysisResult> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    You are an intelligent school lab scheduler for SMK Bina Nusantara.
    
    Current Approved Bookings:
    ${JSON.stringify(bookings.filter(b => b.status === 'Approved'))}

    New Booking Request to Analyze:
    ${JSON.stringify(pendingBooking)}

    The school has 2 Labs: ${LabId.LAB_1} and ${LabId.LAB_2}.
    
    Task:
    1. Check if the new booking request conflicts with any existing approved booking (same lab, overlapping time, same date).
    2. If there is a conflict, suggest an alternative time slot or the other lab on the same date if available.
    3. If there is no conflict, confirm it is safe.

    Return the response in strict JSON format.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conflicts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of conflict descriptions found, if any."
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggestions to resolve conflicts or confirmation of safety."
          },
          isSafe: {
            type: Type.BOOLEAN,
            description: "True if no conflicts found."
          }
        }
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result;
};


export const generateMockSchedule = async (date: string): Promise<Booking[]> => {
    // This function uses Gemini to generate a realistic random schedule for a given date
    // purely for demonstration purposes if the schedule is empty.
    
    const modelId = "gemini-2.5-flash";
    const prompt = `
        Generate a JSON array of 4 realistic computer lab bookings for a vocational school (SMK) on date: ${date}.
        Use these details:
        Labs: "Lab 1 (Multimedia)", "Lab 2 (Network/Code)".
        Classes: "X TJKT 1", "XI TKR 2", "XII Busana", "X Perhotelan".
        Subjects: "Informatika", "Desain Grafis", "Simulasi Digital", "CAD".
        Teachers: "Pak Budi", "Bu Ani", "Pak Dedi", "Bu Rina".
        Times between 07:00 and 15:00. Each booking 90 mins. No overlaps in same lab.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            teacherName: { type: Type.STRING },
                            subject: { type: Type.STRING },
                            rombelName: { type: Type.STRING },
                            labId: { type: Type.STRING },
                            startTime: { type: Type.STRING },
                            endTime: { type: Type.STRING },
                            notes: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const generated = JSON.parse(response.text || "[]");
        
        // Map to Booking interface
        return generated.map((g: any, index: number) => ({
            id: `gen-${Date.now()}-${index}`,
            ...g,
            rombelId: "temp-id", // simplified
            date: date,
            status: "Approved"
        }));
    } catch (e) {
        console.error("Failed to generate schedule", e);
        return [];
    }
}