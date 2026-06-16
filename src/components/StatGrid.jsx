import React from 'react';
import { calculateStats } from '../utils/stats';

const StatGrid = ({ cpuData, count }) => {
  
  const { avg, peak, latest } = calculateStats(cpuData);
  
  
  const currentUsage = latest.cpuUsage;
  const currentMemoryPct = latest.memoryUsedPct;
  const currentMemoryGB = latest.memoryUsedGB;
  const currentDiskPct = latest.diskUsedPercent;
  const currentDiskGB = latest.diskUsedGB;
  const currentUptime = latest.uptime;

  const isCritical = currentUsage >= 90;
  const isWarn = currentUsage >= 70 && currentUsage < 90;

  const formatUptime = (seconds) => {
    if (!seconds) return "0m";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
      {/* 1. CURRENT CPU CARD */}
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className={`absolute top-0 left-0 w-full h-1 ${isCritical ? 'bg-red-500 shadow-[0_0_10px_red]' : isWarn ? 'bg-orange-500 shadow-[0_0_10px_orange]' : 'bg-cyan-400 shadow-[0_0_10px_cyan]'}`}></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>CURRENT CPU</span>
        <div>
           <span className={`text-4xl font-bold ${isCritical ? 'text-red-500' : isWarn ? 'text-orange-500' : 'text-cyan-400'}`}>{currentUsage}%</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>utilization</div>
        </div>
      </div>

      {/* 2. CPU AVG CARD */}
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-cyan-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>CPU AVG (60s)</span>
        <div>
           <span className='text-4xl font-bold text-orange-500'>{avg}%</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>60s average</div>
        </div>
      </div>

      {/* 3. MEMORY CARD */}
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-purple-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>MEMORY</span>
        <div>
           {/* FIX: Removed .toFixed(1) to support pure integer rendering safely */}
           <span className='text-4xl font-bold text-purple-400'>{currentMemoryPct}%</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>Used: {currentMemoryGB} GB</div>
        </div>
      </div>

      {/* 4. DISK CARD */}
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-emerald-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>DISK STORAGE</span>
        <div>
           {/* FIX: Removed .toFixed(1) to support pure integer rendering safely */}
           <span className='text-4xl font-bold text-emerald-400'>{currentDiskPct}%</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>Used: {currentDiskGB} GB</div>
        </div>
      </div>

      {/* 5. SYSTEM UPTIME CARD */}
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-amber-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>SYSTEM UPTIME</span>
        <div>
           <span className='text-3xl font-bold text-amber-400'>{formatUptime(currentUptime)}</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>Continuous runtime</div>
        </div>
      </div>

      {/* 6. CRITICAL SPIKES CARD */}
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className={`absolute top-0 left-0 w-full h-1 ${count > 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>CRITICAL EVENTS</span>
        <div>
           <span className={`text-4xl font-bold ${count > 0 ? 'text-red-500' : 'text-slate-300'}`}>{count}</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>Consecutive spikes &gt;90%</div>
        </div>
      </div>
    </div>
  );
};

export default StatGrid;