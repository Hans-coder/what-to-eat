'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, MapPin, Utensils, Clock } from 'lucide-react';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: { priceLevel: number | null; radius: number; cuisines: string[]; openNow: boolean }) => void;
    initialFilters?: { priceLevel: number | null; radius: number; cuisines: string[]; openNow: boolean };
}

const CUISINE_OPTIONS = [
    '日式', '韓式', '中式', '西式', '泰式',
    '火鍋', '燒肉', '拉麵', '壽司', '早午餐',
    '甜點', '咖啡廳', '居酒屋', '素食'
];

export const FilterDrawer = ({ isOpen, onClose, onApply, initialFilters }: FilterDrawerProps) => {
    const [priceLevel, setPriceLevel] = useState<number | null>(initialFilters?.priceLevel || null);
    const [radius, setRadius] = useState<number>(initialFilters?.radius || 1500);
    const [cuisines, setCuisines] = useState<string[]>(initialFilters?.cuisines || []);
    const [openNow, setOpenNow] = useState<boolean>(initialFilters?.openNow || false);

    useEffect(() => {
        if (initialFilters) {
            setPriceLevel(initialFilters.priceLevel);
            setRadius(initialFilters.radius);
            setCuisines(initialFilters.cuisines || []);
            setOpenNow(initialFilters.openNow || false);
        }
    }, [initialFilters]);

    const handleApply = () => {
        onApply({ priceLevel, radius, cuisines, openNow });
        onClose();
    };

    const handleSaveAsDefault = () => {
        localStorage.setItem('defaultFilters', JSON.stringify({ priceLevel, radius, cuisines, openNow }));
        handleApply();
    };

    const handleReset = () => {
        setPriceLevel(null);
        setRadius(1500);
        setCuisines([]);
        setOpenNow(false);
        localStorage.removeItem('defaultFilters');
    };

    const toggleCuisine = (cuisine: string) => {
        setCuisines(prev =>
            prev.includes(cuisine)
                ? prev.filter(c => c !== cuisine)
                : [...prev, cuisine]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-t-3xl w-full max-w-md shadow-xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-[#4A403A]">篩選條件</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Open Now Filter */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-orange-500" />
                            <span className="font-medium text-[#4A403A]">僅顯示營業中</span>
                        </div>
                        <button
                            onClick={() => setOpenNow(!openNow)}
                            className={`w-12 h-7 rounded-full transition-colors relative ${openNow ? 'bg-orange-500' : 'bg-gray-200'}`}
                        >
                            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${openNow ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Cuisines Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Utensils size={18} className="text-orange-500" />
                            <span className="font-medium text-[#4A403A]">食物種類</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {CUISINE_OPTIONS.map((cuisine) => (
                                <button
                                    key={cuisine}
                                    onClick={() => toggleCuisine(cuisine)}
                                    className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${cuisines.includes(cuisine)
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'bg-orange-50 text-orange-400 hover:bg-orange-100'
                                        }`}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <DollarSign size={18} className="text-orange-500" />
                            <span className="font-medium text-[#4A403A]">預算範圍</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { level: 1, label: '$', desc: '便宜 (<$200)' },
                                { level: 2, label: '$$', desc: '中等 ($200-400)' },
                                { level: 3, label: '$$$', desc: '昂貴 ($400-800)' },
                                { level: 4, label: '$$$$', desc: '奢華 (>$800)' },
                            ].map((budget) => (
                                <button
                                    key={budget.level}
                                    onClick={() => setPriceLevel(budget.level === priceLevel ? null : budget.level)}
                                    className={`py-3 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${priceLevel === budget.level
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-orange-50 text-orange-400 hover:bg-orange-100'
                                        }`}
                                >
                                    <span>{budget.label}</span>
                                    <span className={`text-xs font-normal ${priceLevel === budget.level ? 'opacity-90' : 'opacity-75'}`}>{budget.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Distance Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin size={18} className="text-orange-500" />
                            <span className="font-medium text-[#4A403A]">搜尋距離</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { value: 500, label: '500m' },
                                { value: 1000, label: '1km' },
                                { value: 2000, label: '2km' },
                                { value: 5000, label: '5km' },
                            ].map((distance) => (
                                <button
                                    key={distance.value}
                                    onClick={() => setRadius(distance.value)}
                                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all ${radius === distance.value
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-orange-50 text-orange-400 hover:bg-orange-100'
                                        }`}
                                >
                                    {distance.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 space-y-2">
                    <button
                        onClick={handleSaveAsDefault}
                        className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                    >
                        儲存為預設值並套用
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleReset}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            重置
                        </button>
                        <button
                            onClick={handleApply}
                            className="flex-1 py-3 bg-orange-50 text-orange-500 rounded-xl font-medium hover:bg-orange-100 transition-colors"
                        >
                            套用
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
