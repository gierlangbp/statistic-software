import React, { useCallback } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useData, type DataRow } from '../context/DataContext'; // Import DataRow
import { cn } from '../utils/cn';

export const FileUpload: React.FC = () => {
    const { setData } = useData();
    const [isDragging, setIsDragging] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const parseFile = (file: File) => {
        setError(null);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                if (results.errors.length) {
                    setError(`Error parsing file: ${results.errors[0].message}`);
                    return;
                }
                if (results.data.length === 0) {
                    setError("File is empty");
                    return;
                }
                setData(results.data as DataRow[], file.name);
            },
            error: (err) => {
                setError(`Failed to read file: ${err.message}`);
            }
        });
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/csv' || file.name.endsWith('.csv')) {
            parseFile(file);
        } else {
            setError("Please upload a CSV file.");
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            parseFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-4">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
                    isDragging
                        ? "border-primary bg-primary/5 scale-105"
                        : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
                    "flex flex-col items-center justify-center gap-4"
                )}
            >
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleChange}
                    className="hidden"
                    id="csv-upload"
                />

                <div className="p-4 bg-primary/10 rounded-full text-primary">
                    <Upload size={32} />
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Upload your CSV data
                    </h3>
                    <p className="text-sm text-gray-500">
                        Drag & drop or <label htmlFor="csv-upload" className="text-primary hover:underline cursor-pointer">browse</label>
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <FileText size={12} />
                    <span>Supports CSV files with headers</span>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
        </div>
    );
};
