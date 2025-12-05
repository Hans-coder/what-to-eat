import { useState, useMemo } from 'react';
import { Restaurant } from '@/lib/data';
import { Heart, ArrowRight, RefreshCw } from 'lucide-react';

interface GirlfriendModeProps {
    restaurants: Restaurant[];
    onSelect: (restaurant: Restaurant) => void;
}

export function GirlfriendMode({ restaurants, onSelect }: GirlfriendModeProps) {
    // Filter for good atmosphere or dessert
    const [seed, setSeed] = useState(0);

    const shuffledChoices = useMemo(() => {
        // Filter first
        const safe = restaurants.filter(r =>
            r.rating >= 4.0 &&
            r.user_ratings_total >= 50
        );

        // Fisher-Yates shuffle
        const shuffled = [...safe];
        // Use seed in shuffle (though Math.random is sufficient, triggering re-run is key)
        for (let i = shuffled.length - 1; i > 0; i--) {
            // eslint-disable-next-line react-hooks/purity
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, 4);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restaurants, seed]);

    const handleShuffle = () => {
        setSeed(prev => prev + 1);
    };

    return (
        <div className="bg-pink-50 border border-pink-100 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-pink-600">
                    <Heart className="fill-pink-500" />
                    <h2 className="text-xl font-bold">女友模式</h2>
                </div>
                <button
                    onClick={handleShuffle}
                    className="flex items-center gap-1 text-xs font-bold text-pink-500 bg-white px-3 py-1.5 rounded-full shadow-sm hover:bg-pink-100 transition-colors"
                >
                    <RefreshCw size={12} />
                    換一組
                </button>
            </div>

            <p className="text-pink-800 mb-4 text-sm">
                當她說「隨便」的時候，通常是指「氣氛好又有甜點」。這裡有一些安全選擇：
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shuffledChoices.map(r => (
                    <button
                        key={r.id}
                        onClick={() => onSelect(r)}
                        className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left group"
                    >
                        <div>
                            <div className="font-bold text-gray-800">{r.name}</div>
                            <div className="text-xs text-gray-500">{r.cuisine} • {r.type}</div>
                        </div>
                        <ArrowRight size={16} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                ))}
            </div>
        </div>
    );
}
