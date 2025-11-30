import { useState } from 'react';
import { Restaurant } from '@/lib/data';
import { Dices, Sparkles } from 'lucide-react';

interface RandomizerProps {
    restaurants: Restaurant[];
    onSelect: (restaurant: Restaurant) => void;
}

export function Randomizer({ restaurants, onSelect }: RandomizerProps) {
    const [budget, setBudget] = useState<string>('');
    const [isSpinning, setIsSpinning] = useState(false);

    const handleRandomize = () => {
        setIsSpinning(true);

        // Simulate spinning effect
        setTimeout(() => {
            let pool = restaurants;

            // Optional budget filtering if user entered something
            if (budget) {
                const budgetNum = parseInt(budget);
                // More lenient budget filtering
                const affordable = restaurants.filter(r => {
                    if (r.priceLevel === '$') return true; // Always include cheap options
                    if (r.priceLevel === '$$') return budgetNum >= 300;
                    if (r.priceLevel === '$$$') return budgetNum >= 600;
                    return budgetNum >= 1000;
                });
                if (affordable.length > 0) {
                    pool = affordable;
                }
            }

            // True random selection
            const random = pool[Math.floor(Math.random() * pool.length)];

            onSelect(random);
            setIsSpinning(false);
        }, 1000); // Faster spin
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-yellow-300" />
                <h2 className="text-xl font-bold">不知道吃什麼？</h2>
            </div>

            <p className="text-indigo-100 mb-4 text-sm">
                輸入你的預算，讓命運來決定！
            </p>

            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder="預算 (TWD)"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                    onClick={handleRandomize}
                    disabled={!budget || isSpinning}
                    className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSpinning ? (
                        '選擇中...'
                    ) : (
                        <>
                            <Dices size={20} />
                            幫我選！
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
