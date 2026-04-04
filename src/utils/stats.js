export const calculateStats = (cpuData)=>{
    // Filter out the placeholder elements with empty timestamps
    const validData = cpuData?.filter(d => d.timestamp !== "") || [];

    if(validData.length === 0) return {
        cpuUsages: [],
        avg: 0.0,
        peak: 0,
        status: "idle"
    };
    const cpuUsages = validData.map((d)=>parseFloat(d.cpuUsage)).filter(n => !isNaN(n));
    const avg = Math.round(cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length);
    const peak = Math.max(...cpuUsages);
    const currentUsage = cpuUsages[cpuUsages.length - 1];
    let status = "low";
    if(currentUsage > 80) status = "high";
    else if(currentUsage > 50) status = "medium";
    return {cpuUsages, avg, peak, status};
}


const statusColors = {
    high: "red",
    medium: "yellow",
    low: "green",
    idle: "gray"
}
export const getStatusColor = (status)=> statusColors[status] || "gray";
