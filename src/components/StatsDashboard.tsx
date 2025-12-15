import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { calculateStats, type DescriptiveStats } from '../utils/statistics';
import { ArrowDownAZ, LayoutGrid } from 'lucide-react';
import { Histogram } from './Histogram';
import { ClusteringAnalysis } from './ClusteringAnalysis';
import { QuadrantAnalysis } from './QuadrantAnalysis';
import { PercentileAnalysis } from './PercentileAnalysis';

export const StatsDashboard = () => {
    const {
        data,
        selectedCategory,
        selectedVariables
    } = useData();

    const statsData = useMemo(() => {
        if (!selectedVariables.length) return null;

        if (!selectedCategory) {
            // Overall Analysis
            const results: { variable: string; stats: DescriptiveStats }[] = [];
            selectedVariables.forEach(variable => {
                const values = data
                    .map(row => Number(row[variable]))
                    .filter(val => !isNaN(val));
                const stats = calculateStats(values);
                if (stats) results.push({ variable, stats });
            });
            return { type: 'overall', results };
        } else {
            // Grouped Analysis
            const groups: { [key: string]: { [variable: string]: number[] } } = {};

            // Group data
            data.forEach(row => {
                const groupKey = String(row[selectedCategory]);
                if (!groups[groupKey]) groups[groupKey] = {};

                selectedVariables.forEach(v => {
                    if (!groups[groupKey][v]) groups[groupKey][v] = [];
                    const val = Number(row[v]);
                    if (!isNaN(val)) groups[groupKey][v].push(val);
                });
            });

            // Calculate stats for each group
            const groupedResults: { group: string; variable: string; stats: DescriptiveStats }[] = [];

            Object.entries(groups).forEach(([group, vars]) => {
                Object.entries(vars).forEach(([variable, values]) => {
                    const stats = calculateStats(values);
                    if (stats) groupedResults.push({ group, variable, stats });
                });
            });

            return { type: 'grouped', results: groupedResults };
        }
    }, [data, selectedCategory, selectedVariables]);

    if (!selectedVariables.length) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <LayoutGrid className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Variables Selected</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                    Please select at least one numeric variable from the configuration panel to generic statistics.
                </p>
            </div>
        );
    }

    if (!statsData || !statsData.results.length) {
        return <div className="p-4 text-center text-gray-500">No data available for selected variables.</div>;
    }

    const StatsRow = ({ group, variable, stats }: { group?: string, variable: string, stats: DescriptiveStats }) => (
        <tr className="hover:bg-gray-50/80 transition-colors">
            {group && <td className="px-6 py-4 font-medium text-gray-900">{group}</td>}
            <td className="px-6 py-4 font-medium text-gray-700">{variable}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.n}</td>
            <td className="px-6 py-4 text-right font-medium text-primary">{stats.mean}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.median}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.mode}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.stdDev}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.stdError}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.min}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.max}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.range}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.skewness}</td>
            <td className="px-6 py-4 text-right text-gray-600">{stats.kurtosis}</td>
            <td className="px-6 py-4 text-right text-gray-600">±{stats.confidenceLevel95}</td>
        </tr>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                    <ArrowDownAZ className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-gray-900">
                        {selectedCategory ? `Analysis by ${selectedCategory}` : 'Overall Analysis'}
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b">
                            <tr>
                                {selectedCategory && <th className="px-6 py-3 font-medium">Group</th>}
                                <th className="px-6 py-3 font-medium">Variable</th>
                                <th className="px-6 py-3 font-medium text-right">N</th>
                                <th className="px-6 py-3 font-medium text-right">Mean</th>
                                <th className="px-6 py-3 font-medium text-right">Median</th>
                                <th className="px-6 py-3 font-medium text-right">Mode</th>
                                <th className="px-6 py-3 font-medium text-right">SD</th>
                                <th className="px-6 py-3 font-medium text-right">SE</th>
                                <th className="px-6 py-3 font-medium text-right">Min</th>
                                <th className="px-6 py-3 font-medium text-right">Max</th>
                                <th className="px-6 py-3 font-medium text-right">Range</th>
                                <th className="px-6 py-3 font-medium text-right">Skew</th>
                                <th className="px-6 py-3 font-medium text-right">Kurt</th>
                                <th className="px-6 py-3 font-medium text-right">CI (95%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {statsData.type === 'overall' ? (
                                statsData.results.map((item: any) => (
                                    <StatsRow key={item.variable} variable={item.variable} stats={item.stats} />
                                ))
                            ) : (
                                statsData.results.sort((a: any, b: any) => a.group.localeCompare(b.group)).map((item: any) => (
                                    <StatsRow
                                        key={`${item.group}-${item.variable}`}
                                        group={item.group}
                                        variable={item.variable}
                                        stats={item.stats}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Visualizations Area */}
            {selectedVariables.length > 0 && (
                <div className="space-y-12">
                    {selectedVariables.map(variable => {
                        // If no category selected, show single overall histogram
                        if (!selectedCategory) {
                            const values = data
                                .map(row => Number(row[variable]))
                                .filter(val => !isNaN(val));

                            return (
                                <div key={variable} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{variable} Distribution</h3>
                                    <div className="h-[300px]">
                                        <Histogram
                                            data={values}
                                            variableName={variable}
                                        />
                                    </div>
                                </div>
                            );
                        }

                        // If category selected, show histograms for each group
                        const groups: { [key: string]: number[] } = {};
                        data.forEach(row => {
                            const groupVal = String(row[selectedCategory]);
                            // Skip empty groups if needed, or keep them
                            if (!groups[groupVal]) groups[groupVal] = [];

                            const val = Number(row[variable]);
                            if (!isNaN(val)) groups[groupVal].push(val);
                        });

                        const sortedGroupKeys = Object.keys(groups).sort();

                        return (
                            <div key={variable} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                                        {variable}
                                    </span>
                                    <span className="text-gray-400 text-sm font-normal">grouped by</span>
                                    <span>{selectedCategory}</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {sortedGroupKeys.map(groupName => (
                                        <div key={groupName} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2 text-center truncate" title={groupName}>{groupName}</h4>
                                            <div className="h-[200px]">
                                                <Histogram
                                                    data={groups[groupName]}
                                                    variableName={variable}
                                                    hideTitle={true}
                                                />
                                            </div>
                                            <div className="text-center mt-2 text-xs text-gray-400">
                                                N = {groups[groupName].length}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Percentile Analysis */}
            <PercentileAnalysis />

            {/* Clustering */}
            <ClusteringAnalysis />

            {/* Quadrant */}
            <QuadrantAnalysis />
        </div>
    );
};
