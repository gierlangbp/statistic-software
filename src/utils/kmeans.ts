/**
 * Simple K-Means implementation
 */

export interface Point {
    x: number;
    y: number;
    label?: string;
    cluster?: number;
    [key: string]: any;
}

const distance = (a: Point, b: Point): number => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export const kMeans = (points: Point[], k: number, maxIterations = 50): Point[] => {
    if (points.length === 0 || k <= 0) return points;
    if (k >= points.length) return points.map((p, i) => ({ ...p, cluster: i }));

    // Initialize centroids randomly
    let centroids = points.slice(0, k).map(p => ({ x: p.x, y: p.y }));
    let clusteredPoints = [...points];
    let changed = true;
    let iterations = 0;

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        // Assign points to nearest centroid
        clusteredPoints = clusteredPoints.map(p => {
            let minDist = Infinity;
            let clusterIndex = 0;

            centroids.forEach((c, i) => {
                const dist = distance(p, c);
                if (dist < minDist) {
                    minDist = dist;
                    clusterIndex = i;
                }
            });

            if (p.cluster !== clusterIndex) changed = true;
            return { ...p, cluster: clusterIndex };
        });

        // Recalculate centroids
        centroids = centroids.map((_, i) => {
            const clusterPoints = clusteredPoints.filter(p => p.cluster === i);
            if (clusterPoints.length === 0) return centroids[i]; // Keep old if empty

            const sumX = clusterPoints.reduce((acc, p) => acc + p.x, 0);
            const sumY = clusterPoints.reduce((acc, p) => acc + p.y, 0);
            return {
                x: sumX / clusterPoints.length,
                y: sumY / clusterPoints.length
            };
        });
    }

    return clusteredPoints;
};
