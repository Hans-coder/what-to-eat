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

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            onSelect({ lat, lng, address });
            onClose();
        } catch (error) {
            console.error("Error: ", error);
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
                            disabled={!ready}
                            placeholder="搜尋地點..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF8BA7] text-[#4A403A]"
                            autoFocus
                        />
                    </div>

                    <div className="mt-4 max-h-[300px] overflow-y-auto">
                        {status === "OK" && data.map(({ place_id, description }) => (
                            <button
                                key={place_id}
                                onClick={() => handleSelect(description)}
                                className="w-full text-left p-3 hover:bg-pink-50 rounded-xl transition-colors flex items-center gap-3 group"
                            >
                                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-white transition-colors">
                                    <MapPin size={16} className="text-gray-500 group-hover:text-[#FF6B8B]" />
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
