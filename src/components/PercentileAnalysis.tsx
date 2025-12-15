import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateStats, type DescriptiveStats } from '../utils/statistics';
import { StretchHorizontal } from 'lucide-react';

export const PercentileAnalysis: React.FC = () => {
    const { data, selectedVariables, selectedCategory } = useData();

    const statsData = useMemo(() => {
        if (!selectedVariables.length) return [];

        const results: { variable: string; stats: DescriptiveStats }[] = [];
        selectedVariables.forEach(variable => {
            const values = data
                .map(row => Number(row[variable]))
                .filter(val => !isNaN(val));
            const stats = calculateStats(values);
            if (stats) results.push({ variable, stats });
        });
        return results;
    }, [data, selectedVariables]); // We only do overall analysis for this box plot section for simplicity first. 
    // Wait, user asked for "Percentile Analysis based on Q1,Q2,Q3".

    // If we want to support grouping, it would be a multi-box plot.
    // Let's stick to the selected variables first. If grouped, we show multiple rows?
    // Let's implement support for Grouped view if selectedCategory is present.

    const chartData = useMemo(() => {
        if (!selectedVariables.length) return [];

        if (selectedCategory) {
            // Grouped Visuals
            const groups: { [key: string]: { [variable: string]: number[] } } = {};
            data.forEach(row => {
                const groupKey = String(row[selectedCategory]);
                if (!groups[groupKey]) groups[groupKey] = {};
                selectedVariables.forEach(v => {
                    if (!groups[groupKey][v]) groups[groupKey][v] = [];
                    const val = Number(row[v]);
                    if (!isNaN(val)) groups[groupKey][v].push(val);
                });
            });

            const rows: any[] = [];
            Object.entries(groups).forEach(([groupName, vars]) => {
                Object.entries(vars).forEach(([variable, values]) => {
                    const stats = calculateStats(values);
                    if (stats) rows.push({ label: `${variable} (${groupName})`, stats });
                });
            });
            return rows.sort((a, b) => a.label.localeCompare(b.label));
        } else {
            // Overall
            return statsData.map(item => ({ label: item.variable, stats: item.stats }));
        }
    }, [data, selectedCategory, selectedVariables, statsData]);

    if (!statsData.length) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col animate-in fade-in slide-in-from-bottom-8 mt-6">
            <div className="flex items-center gap-2 mb-6">
                <StretchHorizontal className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-gray-900">Percentile Analysis (Box Plot)</h2>
            </div>

            <div className="space-y-8">
                {chartData.map((item, idx) => (
                    <BoxPlotRow key={idx} label={item.label} stats={item.stats} />
                ))}
            </div>
            <div className="flex justify-center gap-6 mt-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                    <span>Range (Min-Max)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/20 border border-primary rounded-sm"></div>
                    <span>IQR (Q1-Q3)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-primary rounded-sm"></div>
                    <span>Median (Q2)</span>
                </div>
            </div>
        </div>
    );
};

const BoxPlotRow = ({ label, stats }: { label: string, stats: DescriptiveStats }) => {
    const { min, max, q1, median, q3 } = stats;
    const totalRange = max - min;

    // Avoid division by zero
    if (totalRange === 0) return null;

    const getPercent = (val: number) => ((val - min) / totalRange) * 100;

    // const leftWhiskerW = getPercent(q1); // Width from min to q1
    // const iqrW = getPercent(q3) - getPercent(q1); // Width of box
    // const rightWhiskerStart = getPercent(q3);
    // const rightWhiskerW = 100 - rightWhiskerStart; 

    // Actually we use positions relative to min/max
    const iqrW = getPercent(q3) - getPercent(q1);
    const medianPos = getPercent(median);
    const q1Pos = getPercent(q1);

    return (
        <div className="relative">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className="font-medium text-gray-900 w-32 truncate" title={label}>{label}</span>
                <div className="flex gap-4">
                    <span>Min: {min}</span>
                    <span>Q1: {q1}</span>
                    <span className="font-bold text-primary">Q2: {median}</span>
                    <span>Q3: {q3}</span>
                    <span>Max: {max}</span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-8 w-full relative bg-gray-50 rounded-full mt-2">
                {/* Main Range Line */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 -translate-y-1/2"></div>

                {/* Min Ticker */}
                <div className="absolute top-1/2 left-0 w-[2px] h-3 bg-gray-400 -translate-y-1/2"></div>

                {/* Max Ticker */}
                <div className="absolute top-1/2 right-0 w-[2px] h-3 bg-gray-400 -translate-y-1/2"></div>

                {/* IQR Box */}
                <div
                    className="absolute top-1/2 h-full bg-primary/20 border border-primary rounded-sm -translate-y-1/2"
                    style={{ left: `${q1Pos}%`, width: `${iqrW}%` }}
                ></div>

                {/* Median Line */}
                <div
                    className="absolute top-0 h-full w-[3px] bg-primary rounded-full z-10"
                    style={{ left: `${medianPos}%` }}
                ></div>
            </div>
        </div>
    )
}
