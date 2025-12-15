import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as ss from 'simple-statistics';

interface HistogramProps {
    data: number[];
    variableName: string;
    description?: string;
    color?: string;
    hideTitle?: boolean;
}

export const Histogram: React.FC<HistogramProps> = ({
    data,
    variableName,
    description,
    color = "hsl(var(--primary))",
    hideTitle = false
}) => {
    // Calculate bins
    const chartData = useMemo(() => {
        if (!data.length) return [];

        const min = ss.min(data);
        const max = ss.max(data);
        const range = max - min;

        // Rice Rule for bin count ~ 2 * n^(1/3)
        const binCount = Math.ceil(2 * Math.pow(data.length, 1 / 3));
        const binWidth = range / binCount;

        const bins = Array.from({ length: binCount }, (_, i) => {
            const binStart = min + (i * binWidth);
            const binEnd = binStart + binWidth;
            return {
                binStart,
                binEnd,
                label: `${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`,
                count: 0
            };
        });

        data.forEach(val => {
            const binIndex = Math.min(
                Math.floor((val - min) / binWidth),
                binCount - 1
            );
            if (binIndex >= 0) bins[binIndex].count++;
        });

        return bins;
    }, [data]);

    // If hideTitle is true, we return a simpler structure without the card wrapper and title
    if (hideTitle) {
        return (
            <div className="w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 9 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={40}
                        />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={30} />
                        <Tooltip />
                        <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="mb-4">
                <h3 className="font-semibold text-gray-900">{variableName} Distribution</h3>
                {description && <p className="text-xs text-gray-500">{description}</p>}
            </div>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 10 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
