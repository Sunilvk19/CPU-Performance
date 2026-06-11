import React from 'react';
import { useCpuMonitor } from './hooks/useCpuMonitor';
import MainChart from './components/MainChart';
import StatGrid from './components/StatGrid';

function App() {
  const { cpuData, staticData, count } = useCpuMonitor();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h1 style={{ margin: 0 }}> System Performance Monitor</h1>
        {staticData ? (
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>
            <strong>Device:</strong> {staticData.hostname} |{' '}
            <strong>OS:</strong> {staticData.os} ({staticData.platform}) |{' '}
            <strong> Total RAM:</strong> {staticData.memory_total_gb} GB |{' '}
            <strong> Total Storage:</strong> {staticData.disk_total_gb} GB
          </p>
        ) : (
          <p style={{ color: '#999', margin: '5px 0 0 0' }}>Loading system info...</p>
        )}
      </header>

      <StatGrid cpuData={cpuData} count={count} />

      <div style={{ marginTop: '30px' }}>
        <MainChart cpuData={cpuData} />
      </div>
    </div>
  );
}

export default App;