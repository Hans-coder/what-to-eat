import { TrendingUp } from 'lucide-react';

interface DeliveryComparisonProps {
    diff: number;
}

export function DeliveryComparison({ diff }: DeliveryComparisonProps) {
    if (diff === 0) return null;

    return (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 font-semibold mb-3">
                <TrendingUp size={18} />
                <h3>價格比較</h3>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">店內價</span>
                    <span className="font-bold text-green-600">$100</span>
                </div>

                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-green-500 w-3/4"></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">外送價</span>
                    <span className="font-bold text-red-500">${100 + diff}</span>
                </div>

                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-red-500"
                        style={{ width: `${(100 + diff) * 0.75}%` }}
                    ></div>
                </div>

                <p className="text-xs text-blue-600 mt-2 text-center font-medium">
                    店內吃省下 {diff}%！
                </p>
            </div>
        </div>
    );
}
