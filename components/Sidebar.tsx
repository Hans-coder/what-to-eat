'use client';

import { useState, useEffect } from 'react';
import { X, Heart, Check, Trash2 } from 'lucide-react';
import { getWishlist, getEatenWithin7Days, removeFromWishlist, removeFromEaten, BookmarkedRestaurant } from '@/lib/storage';
import { SafeImage } from './SafeImage';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const [activeTab, setActiveTab] = useState<'wishlist' | 'eaten'>('wishlist');
    const [wishlist, setWishlist] = useState<BookmarkedRestaurant[]>([]);
    const [eaten, setEaten] = useState<BookmarkedRestaurant[]>([]);

    // Load data when sidebar opens
    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWishlist(getWishlist());
            setEaten(getEatenWithin7Days());
        }
    }, [isOpen]);

    const handleRemoveWishlist = (id: string) => {
        removeFromWishlist(id);
        setWishlist(getWishlist());
    };

    const handleRemoveEaten = (id: string) => {
        removeFromEaten(id);
        setEaten(getEatenWithin7Days());
    };

    const getPhotoUrl = (photoReference?: string) => {
        if (!photoReference) return '/placeholder-restaurant.jpg';
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 animate-in slide-in-from-left duration-300">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-xl text-[#4A403A]">我的收藏</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`flex-1 py-3 px-4 font-medium transition-colors ${activeTab === 'wishlist'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Heart size={18} />
                            想吃 ({wishlist.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('eaten')}
                        className={`flex-1 py-3 px-4 font-medium transition-colors ${activeTab === 'eaten'
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Check size={18} />
                            已吃過 ({eaten.length})
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100vh-140px)] p-4">
                    {activeTab === 'wishlist' && (
                        <div className="space-y-3">
                            {wishlist.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Heart size={48} className="mx-auto mb-3 opacity-30" />
                                    <p>還沒有想吃的餐廳</p>
                                    <p className="text-sm mt-1">點擊餐廳卡片的愛心來收藏</p>
                                </div>
                            ) : (
                                wishlist.map((restaurant) => (
                                    <div key={restaurant.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="relative h-24">
                                            <SafeImage
                                                src={getPhotoUrl(restaurant.photoReference)}
                                                alt={restaurant.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm text-[#4A403A] mb-1">{restaurant.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{restaurant.vicinity}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-orange-500 font-medium">★ {restaurant.rating}</span>
                                                <button
                                                    onClick={() => handleRemoveWishlist(restaurant.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'eaten' && (
                        <div className="space-y-3">
                            {eaten.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Check size={48} className="mx-auto mb-3 opacity-30" />
                                    <p>還沒有吃過的記錄</p>
                                    <p className="text-sm mt-1">標記已吃過的餐廳</p>
                                </div>
                            ) : (
                                eaten.map((restaurant) => (
                                    <div key={restaurant.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="relative h-24">
                                            <SafeImage
                                                src={getPhotoUrl(restaurant.photoReference)}
                                                alt={restaurant.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                已吃過
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm text-[#4A403A] mb-1">{restaurant.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{restaurant.vicinity}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {Math.ceil((new Date().getTime() - restaurant.addedAt) / (1000 * 60 * 60 * 24))} 天前
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveEaten(restaurant.id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
