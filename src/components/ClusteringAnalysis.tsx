import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { kMeans, type Point } from '../utils/kmeans';
import { Settings2 } from 'lucide-react';

export const ClusteringAnalysis: React.FC = () => {
    const { data, numericHeaders } = useData();
    const [xAxis, setXAxis] = useState<string>('');
    const [yAxis, setYAxis] = useState<string>('');
    const [kClusters, setKClusters] = useState<number>(3);

    // Initialize defaults
    React.useEffect(() => {
        if (numericHeaders.length >= 2) {
            if (!xAxis) setXAxis(numericHeaders[0]);
            if (!yAxis) setYAxis(numericHeaders[1]);
        }
    }, [numericHeaders]);

    const clusteredData = useMemo(() => {
        if (!xAxis || !yAxis || !data.length) return [];

        const points: Point[] = data
            .map(row => ({
                x: Number(row[xAxis]),
                y: Number(row[yAxis]),
                label: `Row`, // Could add label logic
                original: row
            }))
            .filter(p => !isNaN(p.x) && !isNaN(p.y));

        return kMeans(points, kClusters);
    }, [data, xAxis, yAxis, kClusters]);

    const clusters = useMemo(() => {
        if (!clusteredData.length) return [];
        // Group by cluster for separate Scatter series (colors)
        const groups: { [key: number]: Point[] } = {};
        clusteredData.forEach(p => {
            const c = p.cluster ?? 0;
            if (!groups[c]) groups[c] = [];
            groups[c].push(p);
        });
        return groups;
    }, [clusteredData]);

    const clusterColors = [
        "hsl(var(--primary))",
        "#ef4444", // red
        "#22c55e", // green
        "#eab308", // yellow
        "#a855f7", // purple
        "#ec4899", // pink
        "#06b6d4"  // cyan
    ];

    if (numericHeaders.length < 2) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col animate-in fade-in slide-in-from-bottom-8 mt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-gray-900">Cluster Analysis (K-Means)</h2>
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
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">K:</span>
                        <input
                            type="number"
                            min="2"
                            max="7"
                            value={kClusters}
                            onChange={e => setKClusters(Number(e.target.value))}
                            className="w-16 px-2 py-1.5 border rounded-md text-sm bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            <div className="h-[400px] w-full">
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

                        {Object.entries(clusters).map(([clusterId, points]) => (
                            <Scatter
                                key={clusterId}
                                name={`Cluster ${clusterId}`}
                                data={points}
                                fill={clusterColors[Number(clusterId) % clusterColors.length]}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
                Scatter plot showing relationship between {xAxis} and {yAxis} grouped by {kClusters} clusters.
            </p>
        </div>
    );
};
