import { useEffect, useState } from "react";

const TOTAL_TIMELINE_POINTS = 60;

export const useCpuMonitor = (timeRange = "live") => {
  const [cpuData, setCpuData] = useState(() =>
    Array.from({ length: TOTAL_TIMELINE_POINTS }, () => ({
      timestamp: "",
      cpuUsage: 0,
      memoryUsedPct: 0,
      diskUsedPercent: 0,
      memoryUsedMB: 0,
      memoryUsedGB: 0,
      diskUsedGB: 0,
      uptime: 0
    }))
  );

  const [staticData, setStaticData] = useState({
    hostname: "Loading...", os: "", platform: "", memory_total_gb: 0, disk_total_gb: 0
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const res = await fetch("/api/system-info");
        if (!res.ok) throw new Error("Static fetch failed");
        const data = await res.json();
        setStaticData(data);
      } catch (err) {
        console.error("Static fetch error:", err);
      }
    };

    fetchStaticData();
  }, []);

  useEffect(() => {
    // Reset data if switching away from live
    if (timeRange !== "live") {
      setCpuData([]);
    } else {
       setCpuData(Array.from({ length: TOTAL_TIMELINE_POINTS }, () => ({
         timestamp: "", cpuUsage: 0, memoryUsedPct: 0, diskUsedPercent: 0,
         memoryUsedMB: 0, memoryUsedGB: 0, diskUsedGB: 0, uptime: 0
       })));
    }

    const fetchMetricsQueue = async () => {
      try {
        const res = await fetch(`/api/system-info/dynamic?range=${timeRange}`);
        if (!res.ok) throw new Error("Dynamic response failed");
        const backendQueue = await res.json();

        if (Array.isArray(backendQueue) && backendQueue.length > 0) {
          const formattedData = backendQueue.map(item => ({
            timestamp: item.timestamp,
            cpuUsage: item.cpu_usage_percent ?? 0,
            memoryUsedPct: item.memory_used_percent ?? 0,
            memoryUsedMB: item.memory_used_mb ?? 0,
            memoryUsedGB: item.memory_used_mb ? (item.memory_used_mb / 1024).toFixed(2) : 0,
            diskUsedPercent: item.disk_used_percent ?? 0,
            diskUsedGB: item.disk_used_gb ?? 0,
            uptime: item.uptime_seconds ?? 0
          }));

          if (timeRange === "live") {
            setCpuData((prevTimeline) => {
              const freshSegment = formattedData.slice(-TOTAL_TIMELINE_POINTS);
              const preservedSegment = prevTimeline.slice(freshSegment.length);
              return [...preservedSegment, ...freshSegment];
            });
          } else {
             setCpuData(formattedData);
          }

          const spikeCount = backendQueue.filter(
            item => (item.cpu_usage_percent ?? 0) > 90
          ).length;
          setCount(prev => prev + spikeCount);
        }
      } catch (err) {
        console.error("Queue tracking lost:", err);
      }
    };

    fetchMetricsQueue();
    const interval = timeRange === "live" ? 1000 : 60000;
    const poller = setInterval(fetchMetricsQueue, interval);
    return () => clearInterval(poller);
  }, [timeRange]);

  return { cpuData, staticData, count };
};