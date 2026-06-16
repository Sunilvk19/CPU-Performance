export const calculateStats = (cpuData) => {
    
    if (!cpuData || cpuData.length === 0) return {
        avg: 0,
        peak: 0,
        latest: { cpuUsage: 0, memoryUsedPct: 0, diskUsedPercent: 0, memoryUsedGB: 0, diskUsedGB: 0, uptime: 0 }
    };

    const cpuUsages = cpuData.map((d) => d.cpuUsage);
    const avg = Math.round(cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length) || 0;
    const peak = Math.max(...cpuUsages) || 0;

    
    const latest = cpuData[cpuData.length - 1];

    return { avg, peak, latest };
}

const statusColors = {
    high: "red",
    medium: "yellow",
    low: "green",
    idle: "gray"
};

export const getStatusColor = (status) => statusColors[status] || "gray";