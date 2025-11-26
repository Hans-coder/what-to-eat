'use client';

import { useState, useMemo, useEffect } from 'react';
import { restaurants as mockRestaurants, Category, PriceLevel, Restaurant } from '@/lib/data';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FilterSection } from '@/components/FilterSection';
import { Randomizer } from '@/components/Randomizer';
import { GirlfriendMode } from '@/components/GirlfriendMode';
import { RestaurantDetail } from '@/components/RestaurantDetail';
import { UserProfile } from '@/components/UserProfile';
import { UtensilsCrossed, History, Trash2, MapPin, User, Loader2, Navigation, Map } from 'lucide-react';
import { LocationPicker } from '@/components/LocationPicker';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | '全部'>('全部');
  const [selectedPrice, setSelectedPrice] = useState<PriceLevel | '全部'>('全部');
  const [minRating, setMinRating] = useState(0);
  const [maxDistance, setMaxDistance] = useState(3000);
  const [isOpenOnly, setIsOpenOnly] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Profile & Lists State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [eatenHistory, setEatenHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Location State
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('定位中...');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  // Helper to update location and fetch data
  const updateLocation = (lat: number, lng: number, name?: string) => {
    setLocation({ lat, lng });
    setLocationName(name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    fetchRestaurants(lat, lng);
  };

  // Load data from local storage
  useEffect(() => {
    setEatenHistory(JSON.parse(localStorage.getItem('eatenHistory') || '[]'));
    setFavorites(JSON.parse(localStorage.getItem('favorites') || '[]'));
    setWishlist(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  }, []);

  // Get Location
  const handleGetLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    setLocationName('定位中...');

    if (!navigator.geolocation) {
      setLocationError('您的瀏覽器不支援地理定位');
      useFallbackLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        fetchRestaurants(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('無法獲取位置，使用預設地點');
        useFallbackLocation();
      }
    );
  };

  const useFallbackLocation = () => {
    const fallbackLat = 25.0117;
    const fallbackLng = 121.4651;
    setLocation({ lat: fallbackLat, lng: fallbackLng });
    setLocationName('板橋區, 新北市 (預設)');
    fetchRestaurants(fallbackLat, fallbackLng);
  };

  // Fetch Restaurants
  async function fetchRestaurants(lat: number, lng: number) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setRestaurants(data);
      setSearchResults(data); // Initial display
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setRestaurants(mockRestaurants); // Fallback
      setSearchResults(mockRestaurants);
    } finally {
      setIsLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    handleGetLocation();
  }, []);

  // Persistence Helpers
  const updateHistory = (newHistory: string[]) => {
    setEatenHistory(newHistory);
    localStorage.setItem('eatenHistory', JSON.stringify(newHistory));
  };
  const updateFavorites = (newFavs: string[]) => {
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };
  const updateWishlist = (newWish: string[]) => {
    setWishlist(newWish);
    localStorage.setItem('wishlist', JSON.stringify(newWish));
  };

  // Actions
  const toggleMarkEaten = (id: string) => {
    if (eatenHistory.includes(id)) {
      updateHistory(eatenHistory.filter(item => item !== id));
    } else {
      updateHistory([...eatenHistory, id]);
    }
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      updateFavorites(favorites.filter(item => item !== id));
    } else {
      updateFavorites([...favorites, id]);
    }
  };

  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      updateWishlist(wishlist.filter(item => item !== id));
    } else {
      updateWishlist([...wishlist, id]);
    }
  };

  const handleSearch = () => {
    const results = restaurants.filter(r => {
      if (eatenHistory.includes(r.id)) return false;
      if (selectedCategory !== '全部' && r.type !== selectedCategory) return false;
      if (selectedPrice !== '全部' && r.priceLevel !== selectedPrice) return false;
      if (r.rating < minRating) return false;
      if (r.distance > maxDistance) return false;
      if (isOpenOnly && !r.isOpen) return false;
      return true;
    });
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="pb-24 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 sticky top-0 z-20 border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-xl text-white shadow-lg shadow-orange-200">
              <UtensilsCrossed size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">今天吃什麼？</h1>
          </div>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <User size={20} />
          </button>
        </div>

        {/* Location Bar */}
        <div className="flex items-center justify-between gap-2 text-sm text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin size={16} className="text-indigo-500 shrink-0" />
            <span className="truncate font-medium text-slate-700">
              {locationError ? locationError : locationName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsLocationPickerOpen(true)}
              className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="地圖選點"
            >
              <Map size={14} />
            </button>
            <button
              onClick={handleGetLocation}
              className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="重新定位"
            >
              <Navigation size={14} />
            </button>
          </div>
        </div>
      </header>

      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSelect={(lat, lng) => {
          updateLocation(lat, lng, '自選位置');
          setIsLocationPickerOpen(false);
        }}
        initialLat={location?.lat || 25.0117}
        initialLng={location?.lng || 121.4651}
      />

      <div className="p-5 space-y-8 max-w-md mx-auto">
        {/* Randomizer */}
        <Randomizer
          restaurants={searchResults}
          onSelect={setSelectedRestaurant}
        />

        {/* Girlfriend Mode */}
        <GirlfriendMode
          restaurants={restaurants}
          onSelect={setSelectedRestaurant}
        />

        {/* Filters */}
        <FilterSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          maxDistance={maxDistance}
          setMaxDistance={setMaxDistance}
          isOpenOnly={isOpenOnly}
          setIsOpenOnly={setIsOpenOnly}
          onSearch={handleSearch}
        />

        {/* Results List */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-xl font-bold text-slate-800">
              {hasSearched ? '搜尋結果' : '附近餐廳'}
            </h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              {isLoading ? '讀取中...' : `${searchResults.length} 間餐廳`}
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
              <p>正在定位並搜尋美食...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">找不到符合條件的餐廳</p>
              <p className="text-xs text-slate-300 mt-1">試試看放寬篩選條件？</p>
            </div>
          ) : (
            searchResults.map(r => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                onClick={() => setSelectedRestaurant(r)}
              />
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onMarkEaten={toggleMarkEaten}
          isEaten={eatenHistory.includes(selectedRestaurant.id)}
          onToggleFavorite={toggleFavorite}
          isFavorite={favorites.includes(selectedRestaurant.id)}
          onToggleWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(selectedRestaurant.id)}
        />
      )}

      {/* User Profile Drawer */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        favorites={favorites}
        wishlist={wishlist}
        eatenHistory={eatenHistory}
        restaurants={restaurants}
        onSelectRestaurant={setSelectedRestaurant}
      />
    </div>
  );
}
