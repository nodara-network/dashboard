"use client";

interface TimePeriodSelectorProps {
  periods?: string[];
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

export default function TimePeriodSelector({ 
  periods = ["1H", "24H", "7D", "30D", "90D"],
  selectedPeriod = "24H",
  onPeriodChange,
  className = "" 
}: TimePeriodSelectorProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange?.(period)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedPeriod === period
                  ? "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-600 text-cyan-700 dark:text-cyan-400"
                  : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-300 dark:hover:border-cyan-600"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 