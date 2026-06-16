import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const MainChart = ({ cpuData, timeRange, setTimeRange }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-lg font-semibold text-slate-700">CPU Usage History</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-700 outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="live">Live</option>
          <option value="hour">Past Hour </option>
          <option value="day">Past Day </option>
          <option value="month">Past Month </option>
          <option value="year">Past Year</option>
        </select>
      </div>
      <div className="w-full min-w-0 h-62.5 sm:h-75 lg:h-87.5">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart 
          data={cpuData} 
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="cpuColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.1} />
          
          <XAxis 
            dataKey="timestamp" 
            stroke="#64748b" 
            fontSize={10}
            tickLine={false}
            dy={10}
          />
          
          <YAxis 
            domain={[0, 100]} 
            stroke="#64748b" 
            fontSize={10}
            tickLine={false}
          />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#22d3ee' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          
          <Area
            type="monotone"
            dataKey="cpuUsage"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#cpuColor)"
            isAnimationActive={false} 
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainChart;