'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends ImageProps {
    fallbackSrc?: string;
}

export function SafeImage({ src, alt, fallbackSrc = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', ...props }: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt}
            onError={() => setImgSrc(fallbackSrc)}
        />
    );
}
