import React from 'react';
import { calculateStats } from '../utils/stats';

const StatGrid = ({ cpuData, count }) => {
  const stats = calculateStats(cpuData);
  const currentUsage = stats.cpuUsages[stats.cpuUsages.length - 1] ?? 0;
  const isCritical = currentUsage >= 90;
  const isWarn = currentUsage >= 70 && currentUsage < 90;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className={`absolute top-0 left-0 w-full h-1 ${isCritical ? 'bg-red-500 shadow-[0_0_10px_red]' : isWarn ? 'bg-orange-500 shadow-[0_0_10px_orange]' : 'bg-cyan-400 shadow-[0_0_10px_cyan]'}`}></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>CURRENT</span>
        <div>
           <span className={`text-5xl font-bold ${isCritical ? 'text-red-500' : isWarn ? 'text-orange-500' : 'text-cyan-400'}`}>{currentUsage}%</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>% utilization</div>
        </div>
      </div>

      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-cyan-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>AVG (60s)</span>
        <div>
           <span className='text-4xl font-bold text-orange-500'>{stats.avg}%</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>% average</div>
        </div>
      </div>

      
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-cyan-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>PEAK</span>
        <div>
           <span className='text-4xl font-bold text-orange-500'>{stats.peak}%</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>% maximum</div>
        </div>
      </div>

      
      <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-cyan-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>STATUS</span>
        <div>
           <span className={`text-xl font-black tracking-wide uppercase ${isCritical ? 'text-red-500' : isWarn ? 'text-orange-500' : 'text-cyan-400'}`}>
             {isCritical ? 'CRITICAL' : isWarn ? 'WARNING' : 'NORMAL'}
           </span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>
             {isCritical ? 'High CPU pressure' : isWarn ? 'Moderate CPU load' : 'System operating smoothly'}
           </div>
        </div>
      </div>
       <div className='bg-[#182136] border border-slate-700/50 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg'>
        <div className='absolute top-0 left-0 w-full h-1 bg-cyan-500/50'></div>
        <span className='text-slate-400 text-xs font-bold tracking-wider mb-3'>CriticalEvent</span>
        <div>
           <span className='text-4xl font-bold text-orange-500'>{count}</span>
           <div className='text-slate-500 text-xs mt-1 font-medium'>cretical</div>
        </div>
      </div>
    </div>
  );
};

export default StatGrid;
