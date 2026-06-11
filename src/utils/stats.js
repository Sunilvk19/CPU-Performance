export const calculateStats = (cpuData) => {
    // Filter out placeholder elements with empty timestamps
    const validData = cpuData?.filter(d => d.timestamp !== "") || [];

    if (validData.length === 0) return {
        cpuUsages: [],
        avg: 0,
        peak: 0,
        status: "idle",
        currentMemoryPct: 0,
        currentDiskPct: 0,
        currentMemoryGB: 0,
        currentDiskGB: 0,
        currentUptime: 0
    };

    // Calculate CPU stats
    const cpuUsages = validData.map((d) => parseFloat(d.cpuUsage)).filter(n => !isNaN(n));
    const avg = Math.round(cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length) || 0;
    const peak = cpuUsages.length > 0 ? Math.max(...cpuUsages) : 0;
    const currentUsage = cpuUsages.length > 0 ? cpuUsages[cpuUsages.length - 1] : 0;

    let status = "low";
    if (currentUsage > 80) status = "high";
    else if (currentUsage > 50) status = "medium";

    // Grab the absolute latest hardware snapshot
    const latest = validData[validData.length - 1] || {};

    return {
        cpuUsages,
        avg,
        peak,
        currentUsage: Math.round(currentUsage),
        status,
        currentMemoryPct: latest.memoryUsedPct || 0,
        currentDiskPct: latest.diskUsedPercent || 0,
        currentMemoryGB: latest.memoryUsedGB || 0,
        currentDiskGB: latest.diskUsedGB || 0,
        currentUptime: latest.uptime || 0
    };
}

const statusColors = {
    high: "red",
    medium: "yellow",
    low: "green",
    idle: "gray"
}

export const getStatusColor = (status) => statusColors[status] || "gray";