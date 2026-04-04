import React from "react";
import StatGrid from "./components/StatGrid";
import MainChart from "./components/MainChart";
import { useCpuMonitor } from "./hooks/useCpuMonitor";

const App = () => {
  const { cpuData, count } = useCpuMonitor();
  return (
   <div className="min-h-screen bg-[#0b1220] text-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-xs text-gray-400 tracking-widest">
              SYSTEM MONITOR
            </p>
            <h1 className="text-3xl font-bold">
              CPU <span className="text-cyan-400">Performance</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 text-cyan-400 text-sm">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            LIVE • 1s
          </div>
        </div>
        {/* Stats */}
        <StatGrid cpuData={cpuData} count={count} />

        {/* Chart */}
        <div className="bg-[#111827] border border-gray-700 rounded-xl p-4 shadow-lg">
          <MainChart cpuData={cpuData} />
        </div>

      </div>
    </div>
  );
};

export default App;
