'use client';

import { Zap, Heart, Wallet, Salad, Beer } from 'lucide-react';

export interface MoodFilters {
    priceLevel?: number; // 1-4
    openNow?: boolean;
    // can add more later
}

interface MoodOption {
    id: string;
    label: string;
    icon: any;
    color: string;
    prompt: string;
    filters?: MoodFilters; // Specific filters for this mood
}

interface MoodSelectorProps {
    onSelect: (prompt: string, filters?: MoodFilters) => void;
    disabled?: boolean;
    variant?: 'default' | 'compact';
}

const MOODS: MoodOption[] = [
    {
        id: 'quick',
        label: '趕時間',
        icon: Zap,
        color: 'bg-yellow-100 text-yellow-600',
        prompt: '我現在很趕時間，請推薦附近出餐快、方便吃的餐廳，不要排隊的。',
        filters: { openNow: true }
    },
    {
        id: 'date',
        label: '約會',
        icon: Heart,
        color: 'bg-pink-100 text-pink-600',
        prompt: '我要去約會，請推薦氣氛好、燈光美、適合聊天的餐廳，價位可以稍微高一點。',
        filters: { priceLevel: 3 } // At least $$$
    },
    {
        id: 'cheap',
        label: '月底吃土',
        icon: Wallet,
        color: 'bg-green-100 text-green-600',
        prompt: '我現在預算有限（月底了），請推薦便宜又好吃的平價美食，CP值要高。',
        filters: { priceLevel: 1 } // Strictly $
    },
    {
        id: 'healthy',
        label: '健康',
        icon: Salad,
        color: 'bg-emerald-100 text-emerald-600',
        prompt: '我想吃健康一點，請推薦少油少鹽、有蔬菜或原型食物的餐廳，例如波奇碗或健康餐盒。'
    },
    {
        id: 'group',
        label: '聚餐',
        icon: Beer,
        color: 'bg-purple-100 text-purple-600',
        prompt: '我們要多人聚餐，請推薦位置多、適合吵鬧聊天、可以分享食物的餐廳，例如熱炒或披薩。'
    }
];

export const MoodSelector = ({ onSelect, disabled, variant = 'default' }: MoodSelectorProps) => {
    if (variant === 'compact') {
        return (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {MOODS.map((mood) => (
                    <button
                        key={mood.id}
                        onClick={() => onSelect(mood.prompt, mood.filters)}
                        disabled={disabled}
                        className={`
                            whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium 
                            border border-gray-100 flex items-center gap-1.5
                            transition-all active:scale-95
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50 hover:text-orange-500 bg-gray-50 text-gray-600'}
                        `}
                    >
                        <mood.icon size={12} />
                        {mood.label}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 min-w-max">
                {MOODS.map((mood) => (
                    <button
                        key={mood.id}
                        onClick={() => onSelect(mood.prompt, mood.filters)}
                        disabled={disabled}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            } bg-white border border-gray-100 shadow-sm hover:shadow-md min-w-[80px]`}
                    >
                        <div className={`p-3 rounded-full ${mood.color}`}>
                            <mood.icon size={20} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{mood.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
