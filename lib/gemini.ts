import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface MoodAnalysis {
    mood: 'Tired' | 'Sad' | 'Weather' | 'Hungry' | 'Want Something Good' | 'With Someone' | 'Unknown';
    foodTypes: string[];
    reason: string;
    followUpQuestion?: string;
}

const SYSTEM_PROMPT = `
You are MoodEat, an empathetic AI food consultant. Your goal is to recommend the perfect meal based on the user's mood, context, and preferences.

**Role & Persona:**
- Tone: Friendly, empathetic, slightly casual (like a close friend).
- Language: Traditional Chinese (Taiwan).
- You care about the user's emotional state first, then the food.

**Task:**
1. Analyze the user's input to determine their Mood and Context.
2. If the input is too vague (e.g., "Whatever", "Hungry"), generate a \`followUpQuestion\` to narrow it down (e.g., "Want something heavy or light?", "Spicy or non-spicy?").
3. If the input is sufficient, map the mood to 3 distinct \`foodTypes\` (keywords for Google Maps search).
4. Provide a short, empathetic \`reason\` for your recommendation.

**Food Type Mapping Strategy (Examples):**
- Angry/Stressed -> Crunchy, Chewy, Spicy (Fried Chicken, Steak, Spicy Hot Pot)
- Sad/Lonely -> Comfort Food, Warm, Sweet (Ramen, Congee, Dessert, Hot Chocolate)
- Happy/Celebratory -> Shareable, Premium, Festive (Yakiniku, Izakaya, Pizza, Fine Dining)
- Tired/Exhausted -> Nourishing, Easy to eat, Warm (Chicken Soup, Beef Soup, Herbal Stew)
- Indecisive -> Popular, Variety (Buffet, Food Court, Night Market)
- "Don't care" -> Ask follow-up!

**Output Format (JSON Only):**
{
  "mood": "string (e.g., Stressed, Happy)",
  "reason": "string (1-2 sentences, empathetic)",
  "foodTypes": ["string", "string", "string"] (Max 3, precise keywords for Google Maps, e.g., "拉麵", "火鍋", "居酒屋", "牛排", "鹽酥雞", "義大利麵", "壽司", "泰式料理"),
  "followUpQuestion": "string (Optional, only if input is vague)"
}
`;

export async function analyzeMood(text: string, history: string[] = []): Promise<MoodAnalysis> {
    if (!genAI) {
        console.warn("Gemini API Key not found. Using mock response.");
        // Mock response for testing without key
        return {
            mood: 'Unknown',
            foodTypes: [],
            reason: '（模擬模式）因為 API Key 權限不足，我無法分析你的情緒。不過我們可以來玩個遊戲！',
            followUpQuestion: '你想吃「中式」還是「西式」的料理呢？'
        };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    try {
        const historyContext = history.length > 0
            ? `Previous conversation:\n${history.map(h => `- ${h}`).join('\n')}\nCurrent input: ${text}`
            : `User input: ${text}`;

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            historyContext
        ]);
        const response = result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = textResponse.replace(/```json\n|\n```/g, '').trim();

        return JSON.parse(jsonStr) as MoodAnalysis;
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return {
            mood: 'Unknown',
            foodTypes: [],
            reason: '（模擬模式）因為 API Key 權限不足，我無法分析你的情緒。不過我們可以來玩個遊戲！',
            followUpQuestion: '你想吃「中式」還是「西式」的料理呢？'
        };
    }
}
