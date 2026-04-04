import { useEffect, useState } from "react";
const MAX_DATA_POINTS = 60;
export const useCpuMonitor = () => {
  const [cpuData, setCpuData] = useState(() =>
    Array.from({ length: MAX_DATA_POINTS }, () => ({
      timestamp: "",
      cpuUsage: null,
    })),
  );
  const [count, setCount] = useState(parseInt(localStorage.getItem("count")) || 0);
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const cpuUsage = Math.floor(Math.random() * 10) + 90;
      setCpuData((prev) => {
        // const slicedPastData = prev.slice(-(MAX_DATA_POINTS - 1));
        // return [...slicedPastData, { timestamp, cpuUsage }];
        const newDataQueue = [...prev, { timestamp, cpuUsage }];
        if (newDataQueue.length > MAX_DATA_POINTS) {
          newDataQueue.shift(); // O(n)
        }
        return newDataQueue;
      });
      setCount((prev) => (cpuUsage > 90 ? prev + 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    localStorage.setItem("count", count);
  }, [count]);
  return { cpuData, count };
};
