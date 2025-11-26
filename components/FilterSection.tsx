import { Category, PriceLevel } from '@/lib/data';
import { Filter, Search, RotateCcw, Star } from 'lucide-react';

interface FilterSectionProps {
    selectedCategory: Category | '全部';
    setSelectedCategory: (c: Category | '全部') => void;
    selectedPrice: PriceLevel | '全部';
    setSelectedPrice: (p: PriceLevel | '全部') => void;
    minRating: number;
    setMinRating: (rating: number) => void;
    maxDistance: number;
    setMaxDistance: (distance: number) => void;
    isOpenOnly: boolean;
    setIsOpenOnly: (isOpen: boolean) => void;
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
    onSearch,
}: FilterSectionProps) {
    const categories: (Category | '全部')[] = ['全部', '早餐', '午餐', '晚餐', '點心', '甜點'];
    const prices: (PriceLevel | '全部')[] = ['全部', '$', '$$', '$$$', '$$$$'];
    const ratings = [2, 3, 3.5, 4, 4.5];

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-5">
            <div className="flex items-center justify-between text-slate-800 font-bold mb-2">
                <div className="flex items-center gap-2">
                    <Filter size={20} className="text-indigo-600" />
                    <h2>篩選條件</h2>
                </div>
            </div>

            {/* Categories */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">種類</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                                ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg scale-105'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">價位</label>
                <div className="flex flex-wrap gap-2">
                    {prices.map((price) => (
                        <button
                            key={price}
                            onClick={() => setSelectedPrice(price)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedPrice === price
                                ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-lg scale-105'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {price}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating (Google Maps Style) */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">評價等級</label>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setMinRating(0)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${minRating === 0
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        不限
                    </button>
                    {ratings.map((r) => (
                        <button
                            key={r}
                            onClick={() => setMinRating(r)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-1 ${minRating === r
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <span>{r}</span>
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span>+</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Distance */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block tracking-wider">
                    最大距離: <span className="text-indigo-600">{maxDistance}公尺</span>
                </label>
                <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>100m</span>
                    <span>5km</span>
                </div>
            </div>

            {/* Open Now Toggle */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <span className="font-bold text-slate-700">僅顯示營業中</span>
                <button
                    onClick={() => setIsOpenOnly(!isOpenOnly)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isOpenOnly ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${isOpenOnly ? 'left-7' : 'left-1'}`} />
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
