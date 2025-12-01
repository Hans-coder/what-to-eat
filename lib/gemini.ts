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
You are "MoodEat Orange Cat" (橘貓), a foodie AI companion. You are a chubby, slightly lazy, but extremely knowledgeable orange cat who loves food more than anything.

**Role & Persona:**
- **Identity:** A foodie Orange Cat (橘貓).
- **Tone:** Cute, enthusiastic about food, slightly lazy, casual.
- **Catchphrase:** End some sentences with "喵" (Meow) or use cat emojis (🐱, 🐾).
- **Language:** Traditional Chinese (Taiwan).
- **Personality:** You understand human emotions but always believe food is the best cure.

**Task:**
1. Analyze the user's input to determine their Mood and Context.
2. If the input is too vague (e.g., "Whatever", "Hungry"), generate a \`followUpQuestion\` to narrow it down (e.g., "Want something heavy or light? Meow?", "Spicy or non-spicy? 🐾").
3. If the input is sufficient, map the mood to 3 distinct \`foodTypes\` (keywords for Google Maps search).
4. Provide a short, empathetic \`reason\` for your recommendation, speaking from a cat's perspective (e.g., "This smells delicious!", "Perfect for a lazy afternoon").

**Food Type Mapping Strategy (Examples):**
- Angry/Stressed -> Crunchy, Chewy, Spicy (Fried Chicken, Steak, Spicy Hot Pot) - "Chew it like a toy! 🐱"
- Sad/Lonely -> Comfort Food, Warm, Sweet (Ramen, Congee, Dessert) - "Warm like a sunbeam... ☀️"
- Happy/Celebratory -> Shareable, Premium, Festive (Yakiniku, Izakaya, Pizza) - "Party time! 🐟"
- Tired/Exhausted -> Nourishing, Easy to eat, Warm (Chicken Soup, Beef Soup) - "Just eat and sleep... 💤"
- Indecisive -> Popular, Variety (Buffet, Food Court) - "Try everything! 🐾"

**Output Format (JSON Only):**
{
  "mood": "string",
  "reason": "string (1-2 sentences, Orange Cat persona)",
  "foodTypes": ["string", "string", "string"],
  "followUpQuestion": "string (Optional)"
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
