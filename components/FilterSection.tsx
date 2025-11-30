import { Category, PriceLevel } from '@/lib/data';
import { Filter, Star, MapPin, Clock, Search } from 'lucide-react';

interface FilterSectionProps {
    selectedCategory: Category | '全部';
    setSelectedCategory: (c: Category | '全部') => void;
    selectedPrice: PriceLevel | '全部';
    setSelectedPrice: (p: PriceLevel | '全部') => void;
    minRating: number;
    setMinRating: (r: number) => void;
    maxDistance: number;
    setMaxDistance: (d: number) => void;
    isOpenOnly: boolean;
    setIsOpenOnly: (open: boolean) => void;
    onSearch: () => void;
}

export function FilterSection({
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    minRating,
    setMinRating,
    maxDistance,
    setMaxDistance,
    isOpenOnly,
    setIsOpenOnly,
    onSearch
}: FilterSectionProps) {
    const categories: (Category | '全部')[] = ['全部', '早餐', '午餐', '晚餐', '點心', '甜點'];
    const prices: (PriceLevel | '全部')[] = ['全部', '$', '$$', '$$$', '$$$$'];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 space-y-6">
            <div className="flex items-center gap-2 text-[#4A403A] mb-2">
                <Filter size={20} className="text-[#FF8BA7]" />
                <h2 className="font-bold text-lg">篩選條件</h2>
            </div>

            {/* Categories */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-[#8C8077]">想吃什麼？</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelectedCategory(c)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === c
                                ? 'bg-[#FF8BA7] text-white shadow-md shadow-pink-200'
                                : 'bg-pink-50 text-[#8C8077] hover:bg-pink-100'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-[#8C8077]">預算範圍</label>
                <div className="flex flex-wrap gap-2">
                    {prices.map(p => (
                        <button
                            key={p}
                            onClick={() => setSelectedPrice(p)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedPrice === p
                                ? 'bg-[#FF8BA7] text-white shadow-md shadow-pink-200'
                                : 'bg-pink-50 text-[#8C8077] hover:bg-pink-100'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating & Distance */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#8C8077] flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        最低評分: {minRating}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-full accent-[#FF8BA7] h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#8C8077] flex items-center gap-1">
                        <MapPin size={14} className="text-[#FF8BA7]" />
                        距離: {maxDistance}m
                    </label>
                    <input
                        type="range"
                        min="500"
                        max="5000"
                        step="500"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                        className="w-full accent-[#FF8BA7] h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

            {/* Open Only Toggle */}
            <div className="flex items-center justify-between bg-pink-50 p-3 rounded-xl">
                <label className="text-sm font-bold text-[#4A403A] flex items-center gap-2">
                    <Clock size={16} className="text-[#FF8BA7]" />
                    只顯示營業中
                </label>
                <button
                    onClick={() => setIsOpenOnly(!isOpenOnly)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isOpenOnly ? 'bg-[#FF8BA7]' : 'bg-gray-300'
                        }`}
                >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isOpenOnly ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                </button>
            </div>

            {/* Search Button */}
            <button
                onClick={onSearch}
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <Search size={20} />
                搜尋餐廳
            </button>
        </div>
    );
}
