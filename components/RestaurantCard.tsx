import { Restaurant } from '@/lib/data';
import { Star, MapPin, Clock } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-pink-50"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <SafeImage
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-[#4A403A] shadow-sm flex items-center gap-1">
                    <Clock size={12} className="text-[#FF8BA7]" />
                    {restaurant.waitTime} 分
                </div>
                {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg transform -rotate-6">
                            休息中
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-[#4A403A] line-clamp-1 group-hover:text-[#FF8BA7] transition-colors">
                        {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-600">{restaurant.rating}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#8C8077] mb-3">
                    <span className="bg-pink-50 text-[#FF8BA7] px-2 py-0.5 rounded-md text-xs font-medium">
                        {restaurant.cuisine}
                    </span>
                    <span>•</span>
                    <span className="flex items-center text-xs">
                        {restaurant.priceLevel}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                        <MapPin size={12} />
                        {restaurant.distance}m
                    </span>
                </div>

                {restaurant.deals && restaurant.deals.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-pink-50">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#FF6B8B]">
                            <span className="bg-[#FF6B8B] text-white px-1.5 py-0.5 rounded text-[10px]">優惠</span>
                            {restaurant.deals[0]}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
