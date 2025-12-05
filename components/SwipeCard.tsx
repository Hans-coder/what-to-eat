'use client';

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { MapPin, Check, X } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { useState } from 'react';

interface SwipeCardData {
    id: string;
    name: string;
    rating: number;
    vicinity: string;
    photoReference?: string;
}

export interface SwipeCardProps {
    data: SwipeCardData;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    imageSrc: string;
}

export const SwipeCard = ({ data, onSwipeLeft, onSwipeRight, imageSrc }: SwipeCardProps) => {
    const [exitX, setExitX] = useState<number | null>(null);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    const controls = useAnimation();

    const handleDragEnd = async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            setExitX(300);
            await controls.start({ x: 500, opacity: 0 });
            onSwipeRight();
        } else if (info.offset.x < -threshold) {
            setExitX(-300);
            await controls.start({ x: -500, opacity: 0 });
            onSwipeLeft();
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            animate={controls}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0.5, y: 10 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ x: exitX || 0, opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{
                x,
                rotate,
                opacity,
                touchAction: 'none' // Important for mobile drag
            }}
        >
            <div className="relative w-full h-[65vh] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 select-none">
                {/* Image Section */}
                <div className="relative h-[70%] w-full">
                    <SafeImage
                        src={imageSrc}
                        alt={data.name}
                        fill
                        className="object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

                    {/* Overlay Badges */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold text-orange-600 shadow-sm flex items-center gap-1">
                        ★ {data.rating}
                    </div>
                </div>

                {/* Content Section */}
                <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-white p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-2 line-clamp-2">
                            {data.name}
                        </h3>
                        <p className="text-gray-500 text-sm flex items-start gap-1.5 line-clamp-2">
                            <MapPin size={16} className="shrink-0 mt-0.5" />
                            {data.vicinity}
                        </p>
                    </div>

                    {/* Hint Indicators */}
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-400 mt-2">
                        <div className="flex items-center gap-1 text-red-400">
                            <X size={14} /> Skip (左滑)
                        </div>
                        <div className="flex items-center gap-1 text-green-500">
                            Like (右滑) <Check size={14} />
                        </div>
                    </div>
                </div>

                {/* Drag Indicators (visible when dragging) */}
                <motion.div
                    className="absolute top-8 right-8 text-green-500 border-4 border-green-500 rounded-lg px-4 py-2 text-3xl font-bold transform -rotate-12 bg-white/20 backdrop-blur-sm pointer-events-none"
                    style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
                >
                    LIKE
                </motion.div>
                <motion.div
                    className="absolute top-8 left-8 text-red-500 border-4 border-red-500 rounded-lg px-4 py-2 text-3xl font-bold transform rotate-12 bg-white/20 backdrop-blur-sm pointer-events-none"
                    style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
                >
                    NOPE
                </motion.div>
            </div>
        </motion.div>
    );
};
