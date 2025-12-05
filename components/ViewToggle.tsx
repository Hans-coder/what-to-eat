'use client';

import { AlignJustify, Layers } from 'lucide-react';

interface ViewToggleProps {
    viewMode: 'list' | 'swipe';
    onChange: (mode: 'list' | 'swipe') => void;
}

export const ViewToggle = ({ viewMode, onChange }: ViewToggleProps) => {
    return (
        <div className="bg-gray-100 p-1 rounded-full flex gap-1 relative border border-gray-200">
            {/* Animated Background Slider could go here, but simple conditional formatting is fine for now */}

            <button
                onClick={() => onChange('list')}
                className={`
                    relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all
                    ${viewMode === 'list'
                        ? 'bg-white text-orange-500 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'}
                `}
            >
                <AlignJustify size={14} />
                列表
            </button>
            <button
                onClick={() => onChange('swipe')}
                className={`
                    relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all
                    ${viewMode === 'swipe'
                        ? 'bg-white text-orange-500 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'}
                `}
            >
                <Layers size={14} />
                卡片
            </button>
        </div>
    );
};
