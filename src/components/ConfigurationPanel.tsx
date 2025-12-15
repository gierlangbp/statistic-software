import React from 'react';
import { useData } from '../context/DataContext';
import { Settings } from 'lucide-react';
import { cn } from '../utils/cn';

export const ConfigurationPanel: React.FC = () => {
    const {
        categoricalHeaders,
        numericHeaders,
        selectedCategory,
        selectedVariables,
        setSelectedCategory,
        setSelectedVariables
    } = useData();

    const handleVariableToggle = (header: string) => {
        if (selectedVariables.includes(header)) {
            setSelectedVariables(selectedVariables.filter(v => v !== header));
        } else {
            setSelectedVariables([...selectedVariables, header]);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-6 text-gray-800">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Analysis Configuration</h3>
            </div>

            <div className="space-y-6">
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Group By (Category)
                    </label>
                    <div className="relative">
                        <select
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            <option value="">No Grouping (Overall)</option>
                            {categoricalHeaders.map(header => (
                                <option key={header} value={header}>{header}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Variable Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Variables to Analyze
                    </label>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {numericHeaders.length > 0 ? numericHeaders.map((header) => (
                            <div
                                key={header}
                                onClick={() => handleVariableToggle(header)}
                                className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3",
                                    selectedVariables.includes(header)
                                        ? "bg-primary/5 border-primary text-primary"
                                        : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200"
                                )}
                            >
                                <div className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                    selectedVariables.includes(header)
                                        ? "bg-primary border-primary"
                                        : "border-gray-300 bg-white"
                                )}>
                                    {selectedVariables.includes(header) && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm font-medium">{header}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-400 italic">No numeric variables found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
