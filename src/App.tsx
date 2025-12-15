import { DataProvider, useData } from './context/DataContext';
import { FileUpload } from './components/FileUpload';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { StatsDashboard } from './components/StatsDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

const MainContent = () => {
  const { data, fileName, resetData } = useData();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          Statistical Analysis
        </h1>
        <p className="text-gray-500">
          Upload your dataset to generate insights
        </p>
      </header>

      {!data.length ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <FileUpload />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                CSV
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{fileName}</h2>
                <p className="text-xs text-gray-500">{data.length} rows loaded</p>
              </div>
            </div>
            <button
              onClick={resetData}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-50 rounded-md transition-colors"
            >
              Reset Data
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar: Config */}
            <div className="lg:col-span-1">
              <ConfigurationPanel />
            </div>

            {/* Right Area: Dashboard */}
            <div className="lg:col-span-3 space-y-6">
              <StatsDashboard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
    </DataProvider>
  );
}

export default App;
