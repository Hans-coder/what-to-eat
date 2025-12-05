/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { analyzeMood } from '@/lib/gemini';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages, lat, lng, priceLevel, radius = 1500, cuisines = [], eatenIds = [], openNow = false } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0 || !lat || !lng) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const lastMessage = messages[messages.length - 1];
        const history = messages.slice(0, -1).map((m: any) => m.text).filter(Boolean);

        // 1. Analyze Mood
        const analysis = await analyzeMood(lastMessage.text, history);
        console.log('Mood Analysis:', analysis);

        // 2. Search Restaurants based on food types
        // Combine AI food types with selected cuisines
        // We'll search for the first 3 food types + selected cuisines to get a mix
        let searchKeywords = [...analysis.foodTypes.slice(0, 3)];
        if (cuisines && cuisines.length > 0) {
            searchKeywords = [...cuisines, ...searchKeywords];
        }
        // Deduplicate keywords
        searchKeywords = Array.from(new Set(searchKeywords)).slice(0, 5); // Limit to 5 searches max

        let allRestaurants: any[] = [];

        if (GOOGLE_MAPS_API_KEY) {
            const searchPromises = searchKeywords.map(async (keyword) => {
                // Add maxprice parameter if priceLevel is set
                const priceParam = priceLevel ? `&maxprice=${priceLevel}` : '';
                // Add opennow parameter if openNow is true
                const openNowParam = openNow ? '&opennow=true' : '';
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&language=zh-TW&key=${GOOGLE_MAPS_API_KEY}&type=restaurant${priceParam}${openNowParam}`;
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
                // If openNow is requested, ensure business_status is OPERATIONAL and opening_hours.open_now is true
                // Note: Google API 'opennow' param handles this, but double check doesn't hurt
                const statusOk = r.business_status === 'OPERATIONAL';
                const openOk = !openNow || (r.opening_hours && r.opening_hours.open_now);
                const priceOk = !priceLevel || !r.price_level || r.price_level <= priceLevel;
                return ratingOk && statusOk && priceOk && openOk;
            })
            // Sort: High rating first, but deprioritize eaten restaurants
            .sort((a: any, b: any) => {
                const aEaten = eatenIds.includes(a.place_id);
                const bEaten = eatenIds.includes(b.place_id);
                if (aEaten && !bEaten) return 1; // a is eaten, move to bottom
                if (!aEaten && bEaten) return -1; // b is eaten, move to bottom
                return b.rating - a.rating; // otherwise sort by rating
            })
            .slice(0, 5) // Take top 5 (increased from 3)
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
                lat: r.geometry.location.lat,
                lng: r.geometry.location.lng,
                isEaten: eatenIds.includes(r.place_id)
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
