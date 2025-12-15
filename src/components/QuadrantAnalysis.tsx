import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useData } from '../context/DataContext';
import { calculateStats } from '../utils/statistics';
import { LayoutDashboard } from 'lucide-react';

export const QuadrantAnalysis: React.FC = () => {
    const { data, numericHeaders } = useData();
    const [xAxis, setXAxis] = useState<string>('');
    const [yAxis, setYAxis] = useState<string>('');

    // Initialize defaults
    React.useEffect(() => {
        if (numericHeaders.length >= 2) {
            if (!xAxis) setXAxis(numericHeaders[0]);
            if (!yAxis) setYAxis(numericHeaders[1]);
        }
    }, [numericHeaders]);

    const { points, xMean, yMean } = useMemo(() => {
        if (!xAxis || !yAxis || !data.length) return { points: [], xMean: 0, yMean: 0 };

        const rawPoints = data.map(row => ({
            x: Number(row[xAxis]),
            y: Number(row[yAxis]),
            original: row
        })).filter(p => !isNaN(p.x) && !isNaN(p.y));

        const xStats = calculateStats(rawPoints.map(p => p.x));
        const yStats = calculateStats(rawPoints.map(p => p.y));

        const xCutoff = xStats?.mean || 0; // Use MEAN as separator
        const yCutoff = yStats?.mean || 0;

        const classifiedPoints = rawPoints.map(p => {
            let quadrant = '';
            if (p.x >= xCutoff && p.y >= yCutoff) quadrant = 'Q1 (High-High)';
            else if (p.x < xCutoff && p.y >= yCutoff) quadrant = 'Q2 (Low-High)';
            else if (p.x < xCutoff && p.y < yCutoff) quadrant = 'Q3 (Low-Low)';
            else quadrant = 'Q4 (High-Low)';

            return { ...p, quadrant };
        });

        return { points: classifiedPoints, xMean: xCutoff, yMean: yCutoff };
    }, [data, xAxis, yAxis]);

    // Group by quadrant for colors
    const quadrantGroups = useMemo(() => {
        const groups: { [key: string]: any[] } = {};
        points.forEach(p => {
            if (!groups[p.quadrant]) groups[p.quadrant] = [];
            groups[p.quadrant].push(p);
        });
        return groups;
    }, [points]);

    const quadrantColors: { [key: string]: string } = {
        'Q1 (High-High)': "#22c55e", // Green
        'Q2 (Low-High)': "#eab308", // Yellow
        'Q3 (Low-Low)': "#ef4444", // Red
        'Q4 (High-Low)': "#f97316"  // Orange
    };

    if (numericHeaders.length < 2) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col animate-in fade-in slide-in-from-bottom-8 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-gray-900">Quadrant Analysis</h2>
                </div>

                <div className="flex gap-4">
                    <select
                        value={xAxis}
                        onChange={e => setXAxis(e.target.value)}
                        className="px-3 py-1.5 border rounded-md text-sm bg-gray-50"
                    >
                        {numericHeaders.map(h => <option key={h} value={h}>{h} (X)</option>)}
                    </select>
                    <select
                        value={yAxis}
                        onChange={e => setYAxis(e.target.value)}
                        className="px-3 py-1.5 border rounded-md text-sm bg-gray-50"
                    >
                        {numericHeaders.map(h => <option key={h} value={h}>{h} (Y)</option>)}
                    </select>
                </div>
            </div>

            <div className="h-[400px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name={xAxis}
                            label={{ value: xAxis, position: 'bottom', offset: 0 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name={yAxis}
                            label={{ value: yAxis, angle: -90, position: 'left' }}
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <ReferenceLine x={xMean} stroke="red" strokeDasharray="3 3" />
                        <ReferenceLine y={yMean} stroke="red" strokeDasharray="3 3" />

                        {Object.entries(quadrantGroups).map(([quadrant, qs]) => (
                            <Scatter
                                key={quadrant}
                                name={quadrant}
                                data={qs}
                                fill={quadrantColors[quadrant] || "#8884d8"}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
                Quadrant Analysis split by Mean ({xMean.toFixed(2)}, {yMean.toFixed(2)}).
            </p>
        </div>
    );
};
