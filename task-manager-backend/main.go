package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/host"
	"github.com/shirou/gopsutil/v4/mem"
)
type HistoryStorage struct{
	MinuteQueue []DynamicSystemInfo `json:"minutequeue"`
	HourQueue []DynamicSystemInfo `json:"hourqueue"`
	DayQueue []DynamicSystemInfo `json:"dayqueue"`
	MonthQueue []DynamicSystemInfo `json:"monthqueue"`
}
type SystemInfo struct {
	Hostname      string `json:"hostname"`
	OS            string `json:"os"`
	Platform      string `json:"platform"`
	MemoryTotalGB int    `json:"memory_total_gb"`
	DiskTotalGB   int    `json:"disk_total_gb"`
}

type DynamicSystemInfo struct {
	Timestamp       string  `json:"timestamp"`
	CPUUsage        float64 `json:"cpu_usage_percent"`
	MemoryUsedMB    int     `json:"memory_used_mb"`
	MemoryUsedPct   int     `json:"memory_used_percent"`
	DiskUsedGB      int     `json:"disk_used_gb"`
	DiskUsedPercent float64 `json:"disk_used_percent"`
	Uptime          uint64  `json:"uptime_seconds"`
}

var (
	metricsQueue []DynamicSystemInfo
	queueMutex   sync.RWMutex
	maxQueueSize = 60
	history HistoryStorage
)
const historyFile = "history.json"
func loadHistory() {
	data, err := os.ReadFile(historyFile)
	if err == nil {
		_ = json.Unmarshal(data, &history)
	}
	if history.MinuteQueue == nil {
		history.MinuteQueue = make([]DynamicSystemInfo, 0)
	}
	if history.HourQueue == nil {
		history.HourQueue = make([]DynamicSystemInfo, 0)
	}
	if history.DayQueue == nil {
		history.DayQueue = make([]DynamicSystemInfo, 0)
	}
	if history.MonthQueue == nil {
		history.MonthQueue = make([]DynamicSystemInfo, 0)
	}
}
func saveHistory() {
	queueMutex.RLock()
	data, _ := json.Marshal(history)
	queueMutex.RUnlock()
	_ = os.WriteFile(historyFile, data, 0644)
}
func averageMetrics(metrics []DynamicSystemInfo) DynamicSystemInfo {
	if len(metrics) == 0 {
		return DynamicSystemInfo{}
	}
	
	var sumCpu, sumMemPct, sumDiskPct float64
	var sumMemMB, sumDiskGB, sumUptime uint64
	for _, m := range metrics {
		sumCpu += m.CPUUsage
		sumMemMB += uint64(m.MemoryUsedMB)
		sumMemPct += float64(m.MemoryUsedPct)
		sumDiskGB += uint64(m.DiskUsedGB)
		sumDiskPct += m.DiskUsedPercent
		sumUptime += m.Uptime
	}
	count := float64(len(metrics))
	last := metrics[len(metrics)-1]
	
	return DynamicSystemInfo{
		Timestamp:       last.Timestamp,
		CPUUsage:        math.Round((sumCpu/count)*100) / 100,
		MemoryUsedMB:    int(sumMemMB / uint64(count)),
		MemoryUsedPct:   int(sumMemPct / count),
		DiskUsedGB:      int(sumDiskGB / uint64(count)),
		DiskUsedPercent: math.Round((sumDiskPct/count)*100) / 100,
		Uptime:          sumUptime / uint64(count),
	}
}


func collectMetrics() {
	iteration := 0
	for {
		cpuPercent, err := cpu.Percent(time.Second, false) // overall CPU usage
var currentCpu float64
if err != nil {
    fmt.Printf("[ERROR] cpu.Percent: %v\n", err)
} else if len(cpuPercent) > 0 {
    // cpu.Percent already returns a percentage value (e.g., 23.5)
    currentCpu = math.Round(cpuPercent[0]*100) / 100
}

		vmStat, err := mem.VirtualMemory()
if err != nil {
    fmt.Printf("[ERROR] mem.VirtualMemory: %v\n", err)
}

diskStat, err := disk.Usage("/")
if err != nil {
    fmt.Printf("[ERROR] disk.Usage: %v\n", err)
}

uptime, err := host.Uptime()
if err != nil {
    fmt.Printf("[ERROR] host.Uptime: %v\n", err)
}

		snapshot := DynamicSystemInfo{
			Timestamp:       time.Now().Format(time.RFC3339),
			CPUUsage:        currentCpu,
			MemoryUsedMB:    int(vmStat.Used / 1024 / 1024),
			MemoryUsedPct:   int(vmStat.UsedPercent),
			DiskUsedGB:      int(diskStat.Used / 1024 / 1024 / 1024),
			DiskUsedPercent: math.Round(diskStat.UsedPercent*100) / 100,
			Uptime:          uptime,
		}

		queueMutex.Lock()
		metricsQueue = append(metricsQueue, snapshot)
		if len(metricsQueue) > maxQueueSize {
			metricsQueue = metricsQueue[1:]
		}
		queueMutex.Unlock()
		iteration++;
		if iteration%60 == 0 {
			queueMutex.Lock()
			avg := averageMetrics(metricsQueue)
			history.MinuteQueue = append(history.MinuteQueue, avg)
			if len(history.MinuteQueue) > 60 {
				history.MinuteQueue = history.MinuteQueue[1:]
			}
			queueMutex.Unlock()
			go saveHistory()
		}
		if iteration%3600 == 0 {
			queueMutex.Lock()
			if len(history.MinuteQueue) > 0 {
				avg := averageMetrics(history.MinuteQueue)
				history.HourQueue = append(history.HourQueue, avg)
				if len(history.HourQueue) > 24 {
					history.HourQueue = history.HourQueue[1:]
				}
			}
			queueMutex.Unlock()
			 saveHistory()
		}
		if iteration%86400 == 0 {
			queueMutex.Lock()
			if len(history.HourQueue) > 0 {
				avg := averageMetrics(history.HourQueue)
				history.DayQueue = append(history.DayQueue, avg)
				if len(history.DayQueue) > 30 {
					history.DayQueue = history.DayQueue[1:]
				}
			}
			queueMutex.Unlock()
			 saveHistory()
		}
		if iteration%2592000 == 0 { // 30 days
			queueMutex.Lock()
			if len(history.DayQueue) > 0 {
				avg := averageMetrics(history.DayQueue)
				history.MonthQueue = append(history.MonthQueue, avg)
				if len(history.MonthQueue) > 12 { // 12 months in a year
					history.MonthQueue = history.MonthQueue[1:]
				}
			}
			queueMutex.Unlock()
			 saveHistory()
		}
	}
}

func getStaticSystemInfo(c *gin.Context) {
	vmStat, _ := mem.VirtualMemory()
	diskStat, _ := disk.Usage("/")
	hostStat, _ := host.Info()

	c.JSON(http.StatusOK, SystemInfo{
		Hostname:      hostStat.Hostname,
		OS:            hostStat.OS,
		Platform:      hostStat.Platform,
		MemoryTotalGB: int(vmStat.Total / 1024 / 1024 / 1024),
		DiskTotalGB:   int(diskStat.Total / 1024 / 1024 / 1024),
	})
}

func getDynamicSystemInfo(c *gin.Context) {
	queueMutex.RLock()
	defer queueMutex.RUnlock()
	timeRange := c.Query("range")
	switch timeRange {
	case "hour" :
		if history.MinuteQueue == nil {
			c.JSON(http.StatusOK, []DynamicSystemInfo{})
			return
		}
		c.JSON(http.StatusOK, history.MinuteQueue)
	case "day" :
		if history.HourQueue == nil {
			c.JSON(http.StatusOK, []DynamicSystemInfo{})
			return
		}
		c.JSON(http.StatusOK, history.HourQueue)
	case "month":
		if history.DayQueue == nil {
			c.JSON(http.StatusOK, []DynamicSystemInfo{})
			return
		}
		c.JSON(http.StatusOK, history.DayQueue)
	case "year":
		if history.MonthQueue == nil {
			c.JSON(http.StatusOK, []DynamicSystemInfo{} )
			return
		}
		c.JSON(http.StatusOK, history.MonthQueue)
	default:
		if metricsQueue == nil {
			c.JSON(http.StatusOK, []DynamicSystemInfo{})
			return
		}
		c.JSON(http.StatusOK, metricsQueue)
	}
}



func main() {
	fmt.Println("Warming up operating system performance sensors...")
	_, _ = cpu.Percent(time.Second, false)
	loadHistory()
	go collectMetrics()

	router := gin.Default()
	router.SetTrustedProxies([]string{"127.0.0.1"})

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET"},
		AllowHeaders: []string{"Origin", "Content-Type"},
	}))

	router.GET("/system-info", getStaticSystemInfo)
	router.GET("/system-info/dynamic", getDynamicSystemInfo)

	router.Run(":8080")
}