import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
const MainChart = ({ cpuData }) => {
  return (
    <div className="w-full h-[250px] sm:h-[300px] lg:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={cpuData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis ticks={[0, 59]} tickFormatter={(value) => value === 0 ? 59 : 0} />
          <YAxis domain={[0, 100]} />
          <Area
            type="monotone"
            dataKey="cpuUsage"
            stroke="#8884d8"
            strokeWidth={2}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainChart;
