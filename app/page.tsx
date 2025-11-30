'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Send, Sparkles, Navigation, Loader2 } from 'lucide-react';
import { LocationPicker } from '@/components/LocationPicker';
import { SafeImage } from '@/components/SafeImage';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  vicinity: string;
  isOpen: boolean;
  photoReference?: string;
}

interface RecommendationResponse {
  mood: string;
  reason: string;
  foodTypes: string[];
  followUpQuestion?: string;
  restaurants: Restaurant[];
}

interface LocationState {
  lat: number;
  lng: number;
  address?: string;
  error?: string | null;
  loading?: boolean;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text?: string; recommendation?: RecommendationResponse }[]>([]);
  const [location, setLocation] = useState<LocationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
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
          lng: location.lng
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', recommendation: data }]);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "發生錯誤，請稍後再試。" }]);
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
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF6B8B] p-2 rounded-xl">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-[#FF6B8B]">MoodEat</h1>
          </div>

          <button
            onClick={() => setIsLocationPickerOpen(true)}
            className="flex items-center gap-1.5 bg-pink-50 px-3 py-1.5 rounded-full text-xs font-medium text-[#FF6B8B] hover:bg-pink-100 transition-colors"
          >
            <MapPin size={14} />
            <span className="max-w-[120px] truncate">
              {location?.loading ? '定位中...' : location?.address || '選擇地點'}
            </span>
          </button>
        </div>
      </header>

      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onSelect={handleLocationSelect}
      />

      <main className="max-w-md mx-auto p-4 space-y-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8BA7] to-[#FF6B8B] flex items-center justify-center text-white shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-pink-50 text-[#4A403A]">
            <p>嗨！今天心情怎麼樣？跟我說說，我幫你決定吃什麼！</p>
            <p className="text-xs text-[#8C8077] mt-2">試試看：「今天好累」、「跟女友吵架」、「想吃點熱的」</p>
          </div>
        </div>

        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8BA7] to-[#FF6B8B] flex items-center justify-center text-white shrink-0">
                <Sparkles size={16} />
              </div>
            )}

            {msg.role === 'user' ? (
              <div className="bg-[#FF8BA7] p-4 rounded-2xl rounded-tr-none shadow-sm text-white">
                <p>{msg.text}</p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {msg.text && (
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-pink-50 text-[#4A403A]">
                    {msg.text}
                  </div>
                )}
                {msg.recommendation && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-pink-50 text-[#4A403A]">
                      <p className="font-medium mb-1 text-[#FF6B8B]">{msg.recommendation.mood} Mode</p>
                      <p>{msg.recommendation.reason}</p>

                      {msg.recommendation.followUpQuestion && (
                        <div className="mt-3 pt-3 border-t border-pink-100">
                          <p className="font-bold text-[#FF6B8B] flex items-center gap-2">
                            <Sparkles size={14} />
                            {msg.recommendation.followUpQuestion}
                          </p>
                        </div>
                      )}

                      {msg.recommendation.foodTypes && msg.recommendation.foodTypes.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.recommendation.foodTypes.map(t => (
                            <span key={t} className="text-xs bg-pink-50 text-[#FF8BA7] px-2 py-1 rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.recommendation.restaurants && msg.recommendation.restaurants.length > 0 && (
                      <div className="grid gap-4">
                        {msg.recommendation.restaurants.map(r => (
                          <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-50 hover:shadow-md transition-all">
                            <div className="relative h-32">
                              <SafeImage
                                src={getPhotoUrl(r.photoReference)}
                                alt={r.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-[#4A403A]">
                                ★ {r.rating} ({r.user_ratings_total})
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-lg text-[#4A403A] mb-1">{r.name}</h3>
                              <p className="text-sm text-[#8C8077] mb-2">{r.vicinity}</p>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-1 rounded-full ${r.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                  {r.isOpen ? '營業中' : '休息中'}
                                </span>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}&query_place_id=${r.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-[#FF8BA7] flex items-center gap-1"
                                >
                                  導航 <Navigation size={12} />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8BA7] to-[#FF6B8B] flex items-center justify-center text-white shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-pink-50 text-[#4A403A] flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF8BA7] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#FF8BA7] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-[#FF8BA7] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="max-w-md mx-auto p-4 bg-white border-t border-pink-100">
          <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
            {[
              { label: '我好累 😴', text: '我今天好累，想吃點簡單的' },
              { label: '慶祝 🎉', text: '今天要慶祝，想吃好一點的！' },
              { label: '隨便吃 🎲', text: '隨便吃，有什麼推薦的？' },
              { label: '便宜 💰', text: '月底了，想吃便宜一點的' },
              { label: '想吃辣 🌶️', text: '突然想吃辣的！' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.text)}
                className="whitespace-nowrap px-3 py-1.5 bg-pink-50 text-[#FF6B8B] rounded-full text-sm font-medium hover:bg-[#FF6B8B] hover:text-white transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="今天心情怎麼樣？想吃什麼？"
              className="flex-1 bg-pink-50 border-none rounded-full py-3 pl-5 pr-12 text-[#4A403A] placeholder:text-pink-300 focus:ring-2 focus:ring-[#FF8BA7] focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputText.trim()}
              className="p-2 bg-[#FF8BA7] text-white rounded-full hover:bg-[#FF6B8B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
