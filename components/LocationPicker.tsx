'use client';

import { useState, useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { MapPin, X, Search, Loader2 } from 'lucide-react';

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export const LocationPicker = ({ isOpen, onClose, onSelect }: LocationPickerProps) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: 'tw' }, // Limit to Taiwan for now
        },
        debounce: 300,
    });

    const [error, setError] = useState<string | null>(null);

    const handleSelect = async (description: string, placeId?: string) => {
        setValue(description, false);
        clearSuggestions();
        setError(null);

        try {
            // If placeId is provided (from suggestion click), use it directly
            if (placeId) {
                const results = await getGeocode({ placeId });
                const { lat, lng } = await getLatLng(results[0]);
                onSelect({ lat, lng, address: description });
                onClose();
                return;
            }

            // Otherwise, try to use the first suggestion from the list
            const targetPlaceId = data.length > 0 ? data[0].place_id : null;

            if (targetPlaceId) {
                const results = await getGeocode({ placeId: targetPlaceId });
                const { lat, lng } = await getLatLng(results[0]);
                onSelect({ lat, lng, address: description });
                onClose();
            } else {
                // Fallback: use address-based geocoding (requires Geocoding API)
                const results = await getGeocode({ address: description });
                const { lat, lng } = await getLatLng(results[0]);
                onSelect({ lat, lng, address: description });
                onClose();
            }
        } catch (error) {
            console.error("Error: ", error);
            setError("無法取得地點資訊。請選擇建議清單中的地點，或確認 Geocoding API 已啟用。");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-[#4A403A]">選擇地點</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSelect(value);
                                }
                            }}
                            disabled={!ready}
                            placeholder="搜尋地點 (輸入後按 Enter 或選擇建議)"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 text-[#4A403A]"
                            autoFocus
                        />
                        <button
                            onClick={() => handleSelect(value)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <Search size={16} />
                        </button>
                    </div>

                    {error && (
                        <div className="mt-3 p-3 bg-red-50 text-red-500 text-sm rounded-xl flex items-center gap-2">
                            <X size={14} />
                            {error}
                        </div>
                    )}

                    <div className="mt-4 max-h-[300px] overflow-y-auto">
                        {status === "OK" && data.map(({ place_id, description }) => (
                            <button
                                key={place_id}
                                onClick={() => handleSelect(description, place_id)}
                                className="w-full text-left p-3 hover:bg-orange-50 rounded-xl transition-colors flex items-center gap-3 group"
                            >
                                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-white transition-colors">
                                    <MapPin size={16} className="text-gray-500 group-hover:text-orange-500" />
                                </div>
                                <span className="text-[#4A403A] text-sm font-medium line-clamp-1">{description}</span>
                            </button>
                        ))}

                        {status === "ZERO_RESULTS" && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                找不到地點，試試看其他關鍵字？
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
