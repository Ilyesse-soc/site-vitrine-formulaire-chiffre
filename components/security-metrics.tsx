"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Activity, AlertTriangle, TrendingUp, Eye, Target, Clock, Zap } from "lucide-react"

export function SecurityMetrics() {
  const [metrics, setMetrics] = useState({
    threatLevel: 85,
    activeScanners: 12,
    vulnerabilities: 247,
    blockedAttacks: 1842,
    uptime: 99.97,
    responseTime: 0.24,
  })

  const [realTimeData, setRealTimeData] = useState([
    { time: "00:00", threats: 45, blocked: 12 },
    { time: "04:00", threats: 32, blocked: 8 },
    { time: "08:00", threats: 78, blocked: 23 },
    { time: "12:00", threats: 95, blocked: 31 },
    { time: "16:00", threats: 67, blocked: 19 },
    { time: "20:00", threats: 89, blocked: 27 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        threatLevel: Math.max(0, Math.min(100, prev.threatLevel + (Math.random() - 0.5) * 10)),
        activeScanners: Math.max(0, prev.activeScanners + Math.floor((Math.random() - 0.5) * 3)),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 5),
        responseTime: Math.max(0.1, prev.responseTime + (Math.random() - 0.5) * 0.1),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getThreatLevelColor = (level: number) => {
    if (level < 30) return "text-green-600 bg-green-100 dark:bg-green-900/20"
    if (level < 70) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
    return "text-red-600 bg-red-100 dark:bg-red-900/20"
  }

  const getThreatLevelText = (level: number) => {
    if (level < 30) return "LOW"
    if (level < 70) return "MEDIUM"
    return "HIGH"
  }

  return (
    <div className="space-y-6">
      {/* Main Security Dashboard */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Security Overview</CardTitle>
            <Badge className={getThreatLevelColor(metrics.threatLevel)}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {getThreatLevelText(metrics.threatLevel)} RISK
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Threat Level */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Threat Level</span>
              <span className="font-medium text-gray-900 dark:text-white">{metrics.threatLevel.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.threatLevel} className={`h-2 ${getThreatLevelColor(metrics.threatLevel)}`} />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Active Scanners</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.activeScanners}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Blocked Today</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.blockedAttacks.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Vulnerabilities</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.vulnerabilities}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Response Time</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.responseTime.toFixed(2)}s</div>
            </div>
          </div>

          {/* System Status */}
          <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">System Operational</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.uptime}% Uptime</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "scan", target: "192.168.1.0/24", status: "Complete", time: "2s ago" },
              { type: "block", threat: "SQL Injection", source: "185.220.101.32", time: "5s ago" },
              { type: "alert", message: "New CVE detected", severity: "Medium", time: "12s ago" },
              { type: "scan", target: "api.example.com", status: "In Progress", time: "28s ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {activity.type === "scan" && <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                  {activity.type === "block" && <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />}
                  {activity.type === "alert" && (
                    <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.type === "scan" && `Scanning ${activity.target}`}
                      {activity.type === "block" && `Blocked ${activity.threat}`}
                      {activity.type === "alert" && activity.message}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.status || activity.source || activity.severity}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
