import { NextResponse } from 'next/server';
import { analyzeMood } from '@/lib/gemini';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages, lat, lng, priceLevel } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0 || !lat || !lng) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const lastMessage = messages[messages.length - 1];
        const history = messages.slice(0, -1).map((m: any) => m.text).filter(Boolean);

        // 1. Analyze Mood
        const analysis = await analyzeMood(lastMessage.text, history);
        console.log('Mood Analysis:', analysis);

        // 2. Search Restaurants based on food types
        // We'll search for the first 2 food types to get a mix
        let allRestaurants: any[] = [];

        if (GOOGLE_MAPS_API_KEY) {
            const searchPromises = analysis.foodTypes.slice(0, 2).map(async (keyword) => {
                // Add maxprice parameter if priceLevel is set
                const priceParam = priceLevel ? `&maxprice=${priceLevel}` : '';
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&keyword=${encodeURIComponent(keyword)}&language=zh-TW&key=${GOOGLE_MAPS_API_KEY}&type=restaurant${priceParam}`;
                const res = await fetch(url);
                const data = await res.json();
                return data.results || [];
            });

            const results = await Promise.all(searchPromises);
            // Flatten and deduplicate by place_id
            const seen = new Set();
            allRestaurants = results.flat().filter(place => {
                if (seen.has(place.place_id)) return false;
                seen.add(place.place_id);
                return true;
            });
        } else {
            console.warn("No Google Maps API Key. Skipping restaurant search.");
        }

        // 3. Filter and Sort (Simple logic for MVP: Rating >= 4.0, Open Now)
        // Also filter by price_level if specified
        const recommendedRestaurants = allRestaurants
            .filter((r: any) => {
                const ratingOk = r.rating >= 4.0;
                const statusOk = r.business_status === 'OPERATIONAL';
                const priceOk = !priceLevel || !r.price_level || r.price_level <= priceLevel;
                return ratingOk && statusOk && priceOk;
            })
            .slice(0, 3) // Take top 3
            .map((r: any) => ({
                id: r.place_id,
                name: r.name,
                rating: r.rating,
                user_ratings_total: r.user_ratings_total,
                vicinity: r.vicinity,
                types: r.types,
                isOpen: r.opening_hours?.open_now,
                photoReference: r.photos?.[0]?.photo_reference,
                priceLevel: r.price_level,
            }));

        return NextResponse.json({
            mood: analysis.mood,
            reason: analysis.reason,
            foodTypes: analysis.foodTypes,
            followUpQuestion: analysis.followUpQuestion,
            restaurants: recommendedRestaurants
        });

    } catch (error) {
        console.error('Recommendation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
