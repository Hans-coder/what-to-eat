import { X, User, Heart, Bookmark, History, Star } from 'lucide-react';
import { Restaurant } from '@/lib/data';

interface UserProfileProps {
    isOpen: boolean;
    onClose: () => void;
    favorites: string[];
    wishlist: string[];
    eatenHistory: string[];
    restaurants: Restaurant[];
    onSelectRestaurant: (r: Restaurant) => void;
}

export function UserProfile({
    isOpen,
    onClose,
    favorites,
    wishlist,
    eatenHistory,
    restaurants,
    onSelectRestaurant
}: UserProfileProps) {
    if (!isOpen) return null;

    const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
    const wishlistRestaurants = restaurants.filter(r => wishlist.includes(r.id));
    const eatenRestaurants = restaurants.filter(r => eatenHistory.includes(r.id));

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">

                <div className="p-6 bg-indigo-600 text-white">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">我的帳號</h2>
                        <button onClick={onClose} className="p-2 hover:bg-indigo-700 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-400 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white">
                            U
                        </div>
                        <div>
                            <div className="font-bold text-lg">User</div>
                            <div className="text-indigo-200 text-sm">已登入</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-8">

                    {/* Favorites */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                            <Heart className="text-pink-500 fill-pink-500" size={20} />
                            我最愛的餐廳 ({favoriteRestaurants.length})
                        </h3>
                        <div className="space-y-3">
                            {favoriteRestaurants.length === 0 ? (
                                <p className="text-sm text-gray-400">尚未加入最愛</p>
                            ) : (
                                favoriteRestaurants.map(r => (
                                    <div
                                        key={r.id}
                                        onClick={() => { onSelectRestaurant(r); onClose(); }}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        <img src={r.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt={r.name} />
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm">{r.name}</div>
                                            <div className="text-xs text-gray-500">{r.cuisine}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Wishlist */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                            <Bookmark className="text-indigo-500 fill-indigo-500" size={20} />
                            我想吃尚未吃過 ({wishlistRestaurants.length})
                        </h3>
                        <div className="space-y-3">
                            {wishlistRestaurants.length === 0 ? (
                                <p className="text-sm text-gray-400">清單是空的</p>
                            ) : (
                                wishlistRestaurants.map(r => (
                                    <div
                                        key={r.id}
                                        onClick={() => { onSelectRestaurant(r); onClose(); }}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        <img src={r.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt={r.name} />
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm">{r.name}</div>
                                            <div className="text-xs text-gray-500">{r.cuisine}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* History */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                            <History className="text-green-500" size={20} />
                            本週已吃過 ({eatenRestaurants.length})
                        </h3>
                        <div className="space-y-3">
                            {eatenRestaurants.length === 0 ? (
                                <p className="text-sm text-gray-400">本週還沒吃過任何東西</p>
                            ) : (
                                eatenRestaurants.map(r => (
                                    <div
                                        key={r.id}
                                        onClick={() => { onSelectRestaurant(r); onClose(); }}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        <img src={r.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt={r.name} />
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm">{r.name}</div>
                                            <div className="text-xs text-gray-500">{r.cuisine}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* My Reviews (Mock) */}
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                            <Star className="text-yellow-500 fill-yellow-500" size={20} />
                            我的評論
                        </h3>
                        <p className="text-sm text-gray-400">尚無評論紀錄</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
