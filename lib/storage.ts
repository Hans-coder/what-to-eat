// LocalStorage utility for restaurant bookmarking

export interface BookmarkedRestaurant {
    id: string;
    name: string;
    vicinity: string;
    rating: number;
    photoReference?: string;
    addedAt: number; // timestamp
}

const WISHLIST_KEY = 'moodeat_wishlist';
const EATEN_KEY = 'moodeat_eaten';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Wishlist functions
export function addToWishlist(restaurant: Omit<BookmarkedRestaurant, 'addedAt'>): void {
    const wishlist = getWishlist();
    // Check if already exists
    if (wishlist.some(r => r.id === restaurant.id)) {
        return;
    }
    wishlist.push({ ...restaurant, addedAt: Date.now() });
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

export function getWishlist(): BookmarkedRestaurant[] {
    try {
        const data = localStorage.getItem(WISHLIST_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load wishlist:', e);
        return [];
    }
}

export function removeFromWishlist(id: string): void {
    const wishlist = getWishlist().filter(r => r.id !== id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

export function isInWishlist(id: string): boolean {
    return getWishlist().some(r => r.id === id);
}

// Eaten functions
export function addToEaten(restaurant: Omit<BookmarkedRestaurant, 'addedAt'>): void {
    const eaten = getEaten();
    // Remove from wishlist if exists
    removeFromWishlist(restaurant.id);
    // Check if already exists
    if (eaten.some(r => r.id === restaurant.id)) {
        return;
    }
    eaten.push({ ...restaurant, addedAt: Date.now() });
    localStorage.setItem(EATEN_KEY, JSON.stringify(eaten));
}

export function getEaten(): BookmarkedRestaurant[] {
    try {
        const data = localStorage.getItem(EATEN_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load eaten list:', e);
        return [];
    }
}

export function getEatenWithin7Days(): BookmarkedRestaurant[] {
    const now = Date.now();
    const eaten = getEaten();
    // Filter to only include restaurants eaten within 7 days
    const recent = eaten.filter(r => (now - r.addedAt) < SEVEN_DAYS_MS);
    // Update storage to remove old entries
    if (recent.length !== eaten.length) {
        localStorage.setItem(EATEN_KEY, JSON.stringify(recent));
    }
    return recent;
}

export function removeFromEaten(id: string): void {
    const eaten = getEaten().filter(r => r.id !== id);
    localStorage.setItem(EATEN_KEY, JSON.stringify(eaten));
}

export function isInEaten(id: string): boolean {
    return getEatenWithin7Days().some(r => r.id === id);
}

export function getEatenIds(): string[] {
    return getEatenWithin7Days().map(r => r.id);
}
