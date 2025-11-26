'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { UtensilsCrossed } from 'lucide-react';

export function SafeImage({ src, alt, ...props }: ImageProps) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`bg-slate-100 flex flex-col items-center justify-center text-slate-400 ${props.className}`}>
                <div className="bg-slate-200 p-3 rounded-full mb-2">
                    <UtensilsCrossed size={24} className="text-slate-400" />
                </div>
                <span className="text-xs font-bold text-slate-500">圖片準備中</span>
                <span className="text-[10px] text-slate-400">Image Coming Soon</span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            onError={() => setError(true)}
            {...props}
        />
    );
}
