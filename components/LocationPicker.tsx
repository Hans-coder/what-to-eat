import { useEffect, useRef, useState } from 'react';
import { MapPin, X, Check, Search } from 'lucide-react';

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (lat: number, lng: number) => void;
    initialLat: number;
    initialLng: number;
}

export function LocationPicker({ isOpen, onClose, onSelect, initialLat, initialLng }: LocationPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [marker, setMarker] = useState<google.maps.Marker | null>(null);
    const [selectedLocation, setSelectedLocation] = useState({ lat: initialLat, lng: initialLng });

    useEffect(() => {
        if (isOpen && mapRef.current && !map) {
            // Initialize Map
            const newMap = new google.maps.Map(mapRef.current, {
                center: { lat: initialLat, lng: initialLng },
                zoom: 15,
                disableDefaultUI: true,
                clickableIcons: false,
            });

            // Initialize Marker
            const newMarker = new google.maps.Marker({
                position: { lat: initialLat, lng: initialLng },
                map: newMap,
                draggable: true,
                animation: google.maps.Animation.DROP,
            });

            // Listen for drag end
            newMarker.addListener('dragend', () => {
                const pos = newMarker.getPosition();
                if (pos) {
                    setSelectedLocation({ lat: pos.lat(), lng: pos.lng() });
                    newMap.panTo(pos);
                }
            });

            // Listen for map click
            newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    newMarker.setPosition(e.latLng);
                    setSelectedLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                    newMap.panTo(e.latLng);
                }
            });

            setMap(newMap);
            setMarker(newMarker);
        }
    }, [isOpen, initialLat, initialLng, map]);

    // Initialize Autocomplete
    useEffect(() => {
        if (map && inputRef.current) {
            const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                fields: ['geometry', 'name'],
                types: ['establishment', 'geocode'], // Search for businesses and addresses
            });

            autocomplete.bindTo('bounds', map);

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();

                if (!place.geometry || !place.geometry.location) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert("No details available for input: '" + place.name + "'");
                    return;
                }

                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }

                marker?.setPosition(place.geometry.location);
                setSelectedLocation({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
            });
        }
    }, [map, marker]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-2 text-slate-800">
                        <MapPin className="text-indigo-500" />
                        <h2 className="font-bold text-lg">選擇位置</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-2 bg-slate-50 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="搜尋地點或地址..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative bg-slate-100">
                    <div ref={mapRef} className="w-full h-full" />

                    {/* Hint Overlay */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-xs font-medium text-slate-600 pointer-events-none">
                        拖曳圖釘或點擊地圖選擇位置
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-white">
                    <div className="flex justify-between items-center mb-4 text-xs text-slate-500">
                        <span>經度: {selectedLocation.lng.toFixed(6)}</span>
                        <span>緯度: {selectedLocation.lat.toFixed(6)}</span>
                    </div>
                    <button
                        onClick={() => onSelect(selectedLocation.lat, selectedLocation.lng)}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        確認此位置
                    </button>
                </div>
            </div>
        </div>
    );
}
