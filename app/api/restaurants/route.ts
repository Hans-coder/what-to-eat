/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { restaurants as mockRestaurants, generateMockDetails, Restaurant } from '@/lib/data';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '25.0117'; // Default: Banqiao
    const lng = searchParams.get('lng') || '121.4651';
    const radius = searchParams.get('radius') || '2000'; // Increased default radius
    const keyword = searchParams.get('keyword') || ''; // Remove default keyword to broaden results

    // Fallback to mock data if no API key
    if (!apiKey) {
        console.warn('No Google Maps API Key found. Using mock data.');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json(mockRestaurants);
    }

    try {
        let allResults: any[] = [];
        let nextPageToken = '';
        let pageCount = 0;

        // Fetch up to 3 pages (60 results)
        do {
            // Use type=food for broader results, remove keyword restriction
            let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=food&language=zh-TW&key=${apiKey}`;

            if (nextPageToken) {
                url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextPageToken}&key=${apiKey}`;
                // Google requires a short delay before the next_page_token becomes valid
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const response = await fetch(url, { cache: 'no-store' });
            const data = await response.json();

            if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
                console.error('Google Places API Error:', data.status, data.error_message);
                break;
            }

            if (data.results) {
                allResults = [...allResults, ...data.results];
            }

            nextPageToken = data.next_page_token;
            pageCount++;

        } while (nextPageToken && pageCount < 3);

        if (allResults.length === 0) {
            throw new Error('No results from Google Places API');
        }

        const realRestaurants: Restaurant[] = allResults.map((place: any) => {
            const mockDetails = generateMockDetails(place.place_id, place.name, place.types);

            // Calculate distance (simple approximation)
            const R = 6371e3; // metres
            const φ1 = Number(lat) * Math.PI / 180;
            const φ2 = place.geometry.location.lat * Math.PI / 180;
            const Δφ = (place.geometry.location.lat - Number(lat)) * Math.PI / 180;
            const Δλ = (place.geometry.location.lng - Number(lng)) * Math.PI / 180;
            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = Math.round(R * c);

            // Get photo URL
            let imageUrl = mockDetails.imageUrl!;
            if (place.photos && place.photos.length > 0) {
                imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`;
            }

            const isOpen = place.opening_hours?.open_now ?? true;

            return {
                ...mockDetails, // Fill in the missing fields (menu, wait time, etc.)
                id: place.place_id,
                name: place.name,
                rating: place.rating || 0,
                reviewCount: place.user_ratings_total || 0,
                user_ratings_total: place.user_ratings_total || 0,
                distance: distance,
                imageUrl: imageUrl,
                isOpen: isOpen, // Default to true if unknown
            } as Restaurant;
        });

        return NextResponse.json(realRestaurants);

    } catch (error) {
        console.error('Error fetching from Google Places:', error);
        return NextResponse.json(mockRestaurants); // Fallback on error
    }
}
