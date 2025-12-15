import * as ss from 'simple-statistics';

export interface DescriptiveStats {
    n: number;
    mean: number;
    median: number;
    mode: number;
    stdDev: number;
    variance: number;
    kurtosis: number;
    skewness: number;
    range: number;
    min: number;
    max: number;
    stdError: number;
    confidenceLevel95: number;
    q1: number;
    q3: number;
    iqr: number;
}

export const calculateToFixed = (val: number, digits = 4) => {
    return Number(val.toFixed(digits));
};

export const calculateStats = (data: number[]): DescriptiveStats | null => {
    if (!data.length) return null;

    const n = data.length;
    const mean = ss.mean(data);
    const median = ss.median(data);

    // Mode
    let mode = 0;
    try {
        mode = ss.mode(data);
    } catch {
        mode = mean; // Fallback
    }

    const stdDev = ss.standardDeviation(data);
    const variance = ss.variance(data);
    const min = ss.min(data);
    const max = ss.max(data);
    const range = max - min;
    // sampleSkewness requires at least 3 data points
    let skewness = NaN;
    try {
        if (data.length >= 3) {
            skewness = ss.sampleSkewness(data);
        }
    } catch (e) { console.warn('Skewness calc error', e); }

    // sampleKurtosis requires at least 4 data points
    let kurtosis = NaN;
    try {
        if (data.length >= 4) {
            kurtosis = ss.sampleKurtosis(data);
        }
    } catch (e) { console.warn('Kurtosis calc error', e); }

    // Quantiles
    const q1 = ss.quantile(data, 0.25);
    const q3 = ss.quantile(data, 0.75);
    const iqr = q3 - q1;

    // Standard Error = SD / sqrt(n)
    const stdError = stdDev / Math.sqrt(n);

    // Confidence Interval 95% = 1.96 * SE
    const confidenceLevel95 = 1.96 * stdError;

    return {
        n,
        mean: calculateToFixed(mean),
        median: calculateToFixed(median),
        mode: calculateToFixed(mode),
        stdDev: calculateToFixed(stdDev),
        variance: calculateToFixed(variance),
        kurtosis: calculateToFixed(kurtosis),
        skewness: calculateToFixed(skewness),
        range: calculateToFixed(range),
        min: calculateToFixed(min),
        max: calculateToFixed(max),
        stdError: calculateToFixed(stdError),
        confidenceLevel95: calculateToFixed(confidenceLevel95),
        q1: calculateToFixed(q1),
        q3: calculateToFixed(q3),
        iqr: calculateToFixed(iqr)
    };
};
