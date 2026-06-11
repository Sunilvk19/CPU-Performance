import { useEffect, useState } from "react";

const MAX_DATA_POINTS = 10;

export const useCpuMonitor = () => {
  const [cpuData, setCpuData] = useState(() =>
    Array.from({ length: MAX_DATA_POINTS }, () => ({
      timestamp: "",
      cpuUsage: 0,
      memoryUsedPct: 0,
      memoryUsedGB: 0,
      diskUsedPercent: 0,
      diskUsedGB: 0,
      uptime: 0,
    }))
  );

  const [staticData, setStaticData] = useState(0);
  const [count, setCount] = useState(
    parseInt(localStorage.getItem("count"), 10) || 0
  );

  useEffect(() => {
    fetch("/api/system-info")
      .then((res) => res.json())
      .then((data) => setStaticData(data))
      .catch((err) => console.error("Failed to fetch static info:", err));
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/system-info/dynamic");
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();

        const timestamp = new Date().toLocaleTimeString();

        setCpuData((prev) => {
          const next = [
            ...prev,
            {
              timestamp,
              cpuUsage:        data.cpu_usage_percent   ?? 0,
              memoryUsedPct:   data.memory_used_percent ?? 0,
              memoryUsedGB:    data.memory_used_gb      ?? 0,
              diskUsedPercent: data.disk_used_percent   ?? 0,
              diskUsedGB:      data.disk_used_gb        ?? 0,
              uptime:          data.uptime_seconds      ?? 0,
            },
          ];
          if (next.length > MAX_DATA_POINTS) next.shift();
          return next;
        });

        setCount((prev) =>
          (data.cpu_usage_percent ?? 0) > 90 ? prev + 1 : prev
        );
      } catch (err) {
        console.error("Failed to fetch dynamic metrics:", err);
      }
    };

    const interval = setInterval(fetchMetrics, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("count", count);
  }, [count]);

  return { cpuData, staticData, count };
};