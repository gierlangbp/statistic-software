# Antigravity - Statistic Software

A web-based statistical software built with React, Vite, and simple-statistics.

## Features
- **CSV Data Import**: Drag & drop or browse to upload CSV files.
- **Data Configuration**: Select "Group By" categories and numeric variables for analysis.
- **Statistical Dashboard**:
    - Descriptive Statistics (Mean, Median, Mode, SD, Variance, etc.).
    - Grouped Analysis (by Category).
    - Confidence Intervals (95%).
- **Visualizations**:
    - Histograms with Rice Rule binning.
    - K-Means Clustering (Scatter Plot).
    - Quadrant Analysis (High-High, Low-Low, etc.).

## How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Application**:
   Open default browser at `http://localhost:5173`.

## Technologies

- **Vite + React (TypeScript)**: Core framework.
- **Tailwind CSS**: Styling and UI.
- **Recharts**: Data visualization.
- **framer-motion**: UI animations.
- **papaparse**: CSV parsing.
- **simple-statistics**: Statistical calculations.
