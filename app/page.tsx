'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Send, Sparkles, Navigation, Loader2, Cat, SlidersHorizontal, Menu, Heart, Check } from 'lucide-react';
import { LocationPicker } from '@/components/LocationPicker';
import { SafeImage } from '@/components/SafeImage';
import { FilterDrawer } from '@/components/FilterDrawer';
import { Sidebar } from '@/components/Sidebar';
import { addToWishlist, addToEaten, isInWishlist, isInEaten, getEatenIds, removeFromWishlist, removeFromEaten } from '@/lib/storage';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  types: string[];
  isOpen: boolean;
  photoReference?: string;
  priceLevel?: number;
}

interface RecommendationResponse {
  mood: string;
  reason: string;
  foodTypes: string[];
  followUpQuestion?: string;
  restaurants: Restaurant[];
  error?: string | null;
  loading?: boolean;
}

interface LocationState {
  lat: number;
  lng: number;
  address: string;
  loading?: boolean;
  error?: string | null;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text?: string; recommendation?: RecommendationResponse }[]>([]);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [priceLevel, setPriceLevel] = useState<number | null>(null); // 1-4 for $-$$$$
  const [radius, setRadius] = useState<number>(1500);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render for localStorage updates
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setLocation(prev => ({ ...prev!, loading: true, lat: 0, lng: 0 }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: '目前位置',
            loading: false
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation({
            lat: 25.0330,
            lng: 121.5654,
            address: '台北市 (預設)',
            error: "無法取得位置",
            loading: false
          });
        }
      );
    } else {
      setLocation({
        lat: 25.0330,
        lng: 121.5654,
        address: '台北市 (預設)',
        error: "瀏覽器不支援定位",
        loading: false
      });
    }

    // Load default filters from localStorage
    const savedFilters = localStorage.getItem('defaultFilters');
    if (savedFilters) {
      try {
        const { priceLevel: savedPrice, radius: savedRadius } = JSON.parse(savedFilters);
        if (savedPrice) setPriceLevel(savedPrice);
        if (savedRadius) setRadius(savedRadius);
      } catch (e) {
        console.error('Failed to load saved filters:', e);
      }
    }
  }, []);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim() || !location) return;

    setInputText('');
    const newUserMsg = { role: 'user' as const, text: textToSend };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          lat: location.lat,
          lng: location.lng,
          priceLevel: priceLevel,
          radius: radius,
          excludeIds: getEatenIds()
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', recommendation: data }]);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "喵嗚... 發生錯誤了，請稍後再試。 😿" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleSend();
    }
  };

  const getPhotoUrl = (ref?: string) => {
    if (!ref) return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  };

  const handleLocationSelect = (newLocation: { lat: number; lng: number; address: string }) => {
    setLocation({
      lat: newLocation.lat,
      lng: newLocation.lng,
      address: newLocation.address,
      error: null,
      loading: false
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#4A403A] pb-24">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-orange-50 rounded-full text-orange-500 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="bg-orange-500 p-2 rounded-xl">
              <Cat className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-orange-500">MoodEat</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLocationPickerOpen(true)}
              className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full text-xs font-medium text-orange-500 hover:bg-orange-100 transition-colors"
            >
              <MapPin size={14} />
              {location?.address || '定位中...'}
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-orange-50 p-1.5 rounded-full text-orange-500 hover:bg-orange-100 transition-colors"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>
      </header>

      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSelect={handleLocationSelect}
      />

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApply={(filters) => {
          setPriceLevel(filters.priceLevel);
          setRadius(filters.radius);
        }}
        initialFilters={{ priceLevel, radius }}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="max-w-md mx-auto p-4 space-y-6 pb-72">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Cat size={20} />
          </div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-orange-100 text-[#4A403A]">
            <p>喵！今天心情怎麼樣？想吃什麼好料的？跟我說說，本喵幫你決定！ 🐾</p>
            <p className="text-xs text-orange-400 mt-2">試試看：「今天好累」、「跟女友吵架」、「想吃點熱的」</p>
          </div>
        </div>

        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Cat size={20} />
              </div>
            )}

            {msg.role === 'user' ? (
              <div className="bg-orange-500 p-4 rounded-2xl rounded-tr-none shadow-sm text-white">
                <p>{msg.text}</p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {msg.text && (
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-orange-100 text-[#4A403A]">
                    {msg.text}
                  </div>
                )}
                {msg.recommendation && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-orange-100 text-[#4A403A]">
                      <p className="font-medium mb-1 text-orange-500 flex items-center gap-1">
                        <Cat size={14} /> {msg.recommendation.mood} Mode
                      </p>
                      <p>{msg.recommendation.reason}</p>

                      {msg.recommendation.followUpQuestion && (
                        <div className="mt-3 pt-3 border-t border-orange-100">
                          <p className="font-bold text-orange-500 flex items-center gap-2">
                            <Sparkles size={14} />
                            {msg.recommendation.followUpQuestion}
                          </p>
                        </div>
                      )}

                      {msg.recommendation.foodTypes && msg.recommendation.foodTypes.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.recommendation.foodTypes.map(t => (
                            <span key={t} className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Restaurant Cards */}
                    {msg.recommendation.restaurants && msg.recommendation.restaurants.length > 0 && (
                      <div className="space-y-4">
                        {/* One Pick Button */}
                        {msg.recommendation.restaurants.length > 1 && (
                          <button
                            onClick={() => {
                              if (!msg.recommendation?.restaurants) return;
                              const randomIndex = Math.floor(Math.random() * msg.recommendation.restaurants.length);
                              const selected = msg.recommendation.restaurants[randomIndex];
                              // Scroll to the selected card
                              const cardElement = document.getElementById(`restaurant-${selected.id}`);
                              if (cardElement) {
                                cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                cardElement.classList.add('ring-4', 'ring-orange-400', 'ring-offset-2');
                                setTimeout(() => {
                                  cardElement.classList.remove('ring-4', 'ring-orange-400', 'ring-offset-2');
                                }, 2000);
                              }
                            }}
                            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                          >
                            <Sparkles size={18} />
                            喵！幫我選一個！ 🎲
                          </button>
                        )}

                        <div className="grid gap-4">
                          {msg.recommendation.restaurants.map(r => (
                            <div id={`restaurant-${r.id}`} key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-100 hover:shadow-md transition-all group">
                              <div className="relative h-32 overflow-hidden">
                                <SafeImage
                                  src={getPhotoUrl(r.photoReference)}
                                  alt={r.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isInWishlist(r.id)) {
                                        removeFromWishlist(r.id);
                                      } else {
                                        addToWishlist({
                                          id: r.id,
                                          name: r.name,
                                          vicinity: r.vicinity,
                                          rating: r.rating,
                                          photoReference: r.photoReference
                                        });
                                      }
                                      setUpdateTrigger(prev => prev + 1);
                                    }}
                                    className={`p-2 rounded-full backdrop-blur transition-colors ${isInWishlist(r.id)
                                      ? 'bg-orange-500 text-white'
                                      : 'bg-white/90 text-gray-400 hover:text-orange-500'
                                      }`}
                                  >
                                    <Heart size={16} fill={isInWishlist(r.id) ? "currentColor" : "none"} />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (isInEaten(r.id)) {
                                        removeFromEaten(r.id);
                                      } else {
                                        addToEaten({
                                          id: r.id,
                                          name: r.name,
                                          vicinity: r.vicinity,
                                          rating: r.rating,
                                          photoReference: r.photoReference
                                        });
                                      }
                                      setUpdateTrigger(prev => prev + 1);
                                    }}
                                    className={`p-2 rounded-full backdrop-blur transition-colors ${isInEaten(r.id)
                                      ? 'bg-green-500 text-white'
                                      : 'bg-white/90 text-gray-400 hover:text-green-500'
                                      }`}
                                  >
                                    <Check size={16} />
                                  </button>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-[#4A403A]">
                                  ★ {r.rating} ({r.user_ratings_total})
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-lg text-[#4A403A] mb-1 group-hover:text-orange-500 transition-colors">{r.name}</h3>
                                <p className="text-sm text-[#8C8077] mb-3 line-clamp-1">{r.vicinity}</p>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {r.isOpen ? '營業中' : '休息中'}
                                  </span>
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}&query_place_id=${r.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-white bg-orange-400 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-orange-500 transition-colors shadow-sm"
                                  >
                                    導航 <Navigation size={12} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
              <Cat size={20} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-orange-100 text-[#4A403A] flex items-center gap-2">
              <span className="text-sm font-medium text-orange-400">橘貓思考中...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="max-w-md mx-auto p-4 bg-white border-t border-orange-100">
          {/* Quick Actions */}
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-3">
            {[
              { label: '我好累 😴', text: '喵... 我今天好累，想吃點簡單的' },
              { label: '慶祝 🎉', text: '今天要慶祝！吃頓好的！' },
              { label: '隨便吃 🐟', text: '隨便吃，有什麼推薦的罐罐...啊不是，是餐廳？' },
              { label: '便宜 💰', text: '月底了，想吃便宜一點的' },
              { label: '想吃辣 🌶️', text: '突然想吃辣的！' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.text)}
                className="whitespace-nowrap px-3 py-1.5 bg-orange-50 text-orange-500 rounded-full text-sm font-medium hover:bg-orange-500 hover:text-white transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="跟橘貓說說你想吃什麼..."
              className="flex-1 bg-orange-50 border-none rounded-full py-3 pl-5 pr-12 text-[#4A403A] placeholder:text-orange-300 focus:ring-2 focus:ring-orange-400 focus:outline-none h-12"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="h-12 w-12 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
