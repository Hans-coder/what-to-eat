import { Restaurant } from '@/lib/data';
import { X, MapPin, Clock, Phone, Globe, Star, Utensils, ThumbsUp, ThumbsDown, Heart, Bookmark, Check, Gift, Cake, Tag, Calendar, TrendingUp, ChevronUp, ChevronDown, AlertTriangle, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { SafeImage } from './SafeImage';

interface RestaurantDetailProps {
    restaurant: Restaurant;
    onClose: () => void;
    onMarkEaten: (id: string) => void;
    isEaten: boolean;
    onToggleFavorite: (id: string) => void;
    isFavorite: boolean;
    onToggleWishlist: (id: string) => void;
    isWishlisted: boolean;
}

export function RestaurantDetail({
    restaurant,
    onClose,
    onMarkEaten,
    isEaten,
    onToggleFavorite,
    isFavorite,
    onToggleWishlist,
    isWishlisted
}: RestaurantDetailProps) {
    const [showMenu, setShowMenu] = useState(true); // Default open to show images

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

                {/* Header Image */}
                <div className="relative h-64 w-full group">
                    <SafeImage
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors backdrop-blur-md z-10"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-24">
                        <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{restaurant.name}</h2>
                        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                            <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">{restaurant.cuisine}</span>
                            <span>•</span>
                            <span>{restaurant.priceLevel}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onToggleFavorite(restaurant.id)}
                            className={`flex-1 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-colors border ${isFavorite
                                ? 'bg-pink-50 text-pink-600 border-pink-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <Heart size={20} className={isFavorite ? 'fill-pink-600' : ''} />
                            <span className="text-xs">最愛</span>
                        </button>

                        <button
                            onClick={() => onToggleWishlist(restaurant.id)}
                            className={`flex-1 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-colors border ${isWishlisted
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <Bookmark size={20} className={isWishlisted ? 'fill-indigo-600' : ''} />
                            <span className="text-xs">想吃</span>
                        </button>

                        <button
                            onClick={() => onMarkEaten(restaurant.id)}
                            className={`flex-1 py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-colors border ${isEaten
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {isEaten ? <Check size={20} /> : <UtensilsCrossedIcon size={20} />}
                            <span className="text-xs">{isEaten ? '本週已吃' : '標記已吃'}</span>
                        </button>
                    </div>

                    {restaurant.reservationLink && (
                        <a
                            href={restaurant.reservationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            <Calendar size={18} />
                            立即訂位
                        </a>
                    )}

                    {/* Must Try */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">必點推薦</h3>
                        <div className="flex flex-wrap gap-2">
                            {restaurant.mustTry.map(item => (
                                <span key={item} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-100">
                                    ★ {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase">等候時間</span>
                            </div>
                            <p className="font-bold text-slate-900 text-lg">{restaurant.waitTime} <span className="text-sm font-normal text-slate-500">分鐘</span></p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Calendar size={16} />
                                <span className="text-xs font-bold uppercase">建議訂位</span>
                            </div>
                            <p className="font-bold text-slate-900 text-lg">
                                {restaurant.advanceBookingDays > 0 ? `提前 ${restaurant.advanceBookingDays} 天` : '無需'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{restaurant.reservationInfo}</p>
                        </div>
                    </div>

                    {/* Menu & Price Comparison */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                <TrendingUp size={18} className="text-blue-600" />
                                菜單與價格比較
                            </div>
                            {showMenu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>

                        {showMenu && (
                            <div className="p-4 bg-white space-y-4">
                                {restaurant.menu.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-3 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <SafeImage
                                                src={item.imageUrl || ''}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400">店內價</span>
                                                    <span className="font-bold text-green-600">${item.price}</span>
                                                </div>
                                                <div className="w-px h-8 bg-gray-200"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400">外送價</span>
                                                    <span className="font-bold text-red-500">${item.deliveryPrice}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                                    <p className="text-xs text-blue-600 font-medium">
                                        平均價差: {restaurant.deliveryPriceDiff}% (店內吃比較划算！)
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Review Analysis */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Pros */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-3">
                            <h3 className="font-bold text-green-800 flex items-center gap-2">
                                <ThumbsUp size={18} />
                                網友好評
                            </h3>
                            <div className="space-y-2">
                                {restaurant.reviewAnalysis.positivePoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-green-700">
                                        <Check size={14} className="mt-0.5 shrink-0" />
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cons */}
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 space-y-3">
                            <h3 className="font-bold text-red-800 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                評論雷點
                            </h3>

                            {restaurant.reviewAnalysis.isIncentivized && (
                                <div className="bg-white p-2 rounded-lg border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
                                    ⚠️ 注意：此店家可能有「打卡送餐」洗評論活動
                                </div>
                            )}

                            <div className="space-y-2">
                                {restaurant.reviewAnalysis.negativePoints.map((point, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-red-700">
                                        <ThumbsDown size={14} className="mt-0.5 shrink-0" />
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Deals */}
                    {restaurant.deals.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Gift size={18} className="text-red-500" />
                                優惠資訊
                            </h3>
                            <div className="space-y-2">
                                {restaurant.deals.map((deal, i) => (
                                    <div key={i} className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${deal.includes('壽星') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                                        {deal.includes('壽星') ? <Cake size={16} /> : <Tag size={16} />}
                                        {deal}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Payment */}
                    <div>
                        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                            <CreditCard size={18} />
                            <h3>支付方式</h3>
                        </div>
                        <div className="flex gap-2">
                            {restaurant.paymentMethods.map(pm => (
                                <span key={pm} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600 font-medium">
                                    {pm}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function UtensilsCrossedIcon({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
            <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 2 2c2.4 2.4 5.7.9 7.3-2.8" />
            <path d="m2.1 21.8 6.4-6.3" />
            <path d="m19 5-7 7" />
        </svg>
    )
}
