import { createContext, useContext, useState, type ReactNode } from 'react';

export interface DataRow {
    [key: string]: string | number;
}

interface DataContextType {
    data: DataRow[];
    headers: string[];
    numericHeaders: string[];
    categoricalHeaders: string[];
    fileName: string | null;
    selectedCategory: string | null;
    selectedVariables: string[];
    setSelectedCategory: (category: string | null) => void;
    setSelectedVariables: (variables: string[]) => void;
    setData: (data: DataRow[], name: string) => void;
    resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [data, setDataState] = useState<DataRow[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [numericHeaders, setNumericHeaders] = useState<string[]>([]);
    const [categoricalHeaders, setCategoricalHeaders] = useState<string[]>([]);

    // Selection State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedVariables, setSelectedVariables] = useState<string[]>([]);

    const setData = (parsedData: DataRow[], name: string) => {
        if (!parsedData.length) return;

        const firstRow = parsedData[0];
        const allHeaders = Object.keys(firstRow);

        const numerics: string[] = [];
        const categoricals: string[] = [];

        // Helper to parse numbers with commas, spaces, currency symbols
        const parseFlexibleNumber = (val: any): number => {
            if (typeof val === 'number') return val;
            if (typeof val === 'string') {
                // Remove spaces and currency symbols first
                let cleaned = val.replace(/[\s$€£]/g, '');

                // US/Standard: remove commas.
                cleaned = cleaned.replace(/,/g, '');

                // Check if result is empty or just minus
                if (cleaned.trim() === '' || cleaned === '-') return NaN;

                const num = Number(cleaned);
                return !isNaN(num) ? num : NaN;
            }
            return NaN;
        };

        // 1. Identify Column Types by checking ALL rows (or a large sample)
        allHeaders.forEach(header => {
            let validNumericCount = 0;
            let totalNonEmptyCount = 0;

            // Check first 100 rows for efficiency
            const sampleSize = Math.min(parsedData.length, 100);

            for (let i = 0; i < sampleSize; i++) {
                const val = parsedData[i][header];
                if (val === '' || val === null || val === undefined) continue;

                totalNonEmptyCount++;
                const num = parseFlexibleNumber(val);
                if (!isNaN(num)) {
                    validNumericCount++;
                }
            }

            // Heuristic: If > 80% of non-empty values are numeric, treat as Numeric Column
            // This handles dirty data (e.g. one "N/A" string in a number column)
            const isMostlyNumeric = totalNonEmptyCount > 0 && (validNumericCount / totalNonEmptyCount) > 0.8;

            if (isMostlyNumeric) numerics.push(header);
            else categoricals.push(header);
        });

        // 2. Clean the Data
        const cleanedData = parsedData.map(row => {
            const newRow: DataRow = { ...row };
            numerics.forEach(header => {
                const val = newRow[header];
                const num = parseFlexibleNumber(val);
                // Store number if valid, otherwise store null (standardize missing values)
                if (!isNaN(num)) {
                    newRow[header] = num;
                } else {
                    // It was detected as numeric column, but this specific value is bad.
                    // We use NaN so stats engine can filter it out.
                    newRow[header] = NaN;
                }
            });
            return newRow;
        });

        setDataState(cleanedData);
        setHeaders(allHeaders);
        setNumericHeaders(numerics);
        setCategoricalHeaders(categoricals);
        setFileName(name);

        // Auto-select defaults
        if (categoricals.length > 0) setSelectedCategory(categoricals[0]);
        if (numerics.length > 0) setSelectedVariables([numerics[0]]);
    };

    const resetData = () => {
        setDataState([]);
        setHeaders([]);
        setNumericHeaders([]);
        setCategoricalHeaders([]);
        setFileName(null);
        setSelectedCategory(null);
        setSelectedVariables([]);
    };

    return (
        <DataContext.Provider value={{
            data,
            headers,
            numericHeaders,
            categoricalHeaders,
            fileName,
            selectedCategory,
            selectedVariables,
            setSelectedCategory,
            setSelectedVariables,
            setData,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
