import { Restaurant } from '@/lib/data';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
            onClick={onClick}
        >
            <div className="relative h-48 w-full">
                <SafeImage
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1 z-10">
                    <Clock size={12} />
                    {restaurant.waitTime} 分鐘
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-slate-700">{restaurant.rating}</span>
                        <span className="text-[10px] text-slate-400">({restaurant.reviewCount})</span>
                    </div>
                    <div className={`px-2 py-1 rounded-lg shadow-sm text-xs font-bold text-white ${restaurant.isOpen ? 'bg-green-500' : 'bg-slate-400'}`}>
                        {restaurant.isOpen ? '營業中' : '休息中'}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">{restaurant.cuisine}</span>
                    <span className="flex items-center text-green-600 font-medium">
                        {restaurant.priceLevel}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {restaurant.distance}公尺
                    </span>
                </div>

                <div className="space-y-1">
                    <p className="text-xs text-gray-500 line-clamp-1">
                        <span className="font-semibold text-gray-700">必點:</span> {restaurant.mustTry.join(', ')}
                    </p>
                    {restaurant.deals.length > 0 && (
                        <p className="text-xs text-red-500 font-medium line-clamp-1">
                            🎁 {restaurant.deals[0]}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
