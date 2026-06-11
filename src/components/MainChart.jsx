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

const MainChart = ({ cpuData = [] }) => {
  const chartData = cpuData.filter(
    (point) => point.timestamp && point.cpuUsage !== 0 && point.cpuUsage !== undefined
  );

  return (
    <div className="w-full min-w-0 h-62.5 sm:h-75 lg:h-87.5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="timestamp" 
            stroke="#64748b" 
            fontSize={10}
            tickLine={false}
            dy={10}
            minTickGap={24}
            hide={chartData.length === 0}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="#64748b" 
            fontSize={10}
            tickLine={false}
            width={34}
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
            fill="url(#chartGradient)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainChart;
