"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Activity,
  AlertTriangle,
  TrendingUp,
  Eye,
  Target,
  Clock,
  ArrowLeft,
  Download,
  Settings,
  RefreshCw,
  Server,
  Database,
} from "lucide-react"
import Link from "next/link"
import { SecurityMetrics } from "@/components/security-metrics"
import { NetworkScanner } from "@/components/network-scanner"
import { ThreatIntelligence } from "@/components/threat-intelligence"

interface DashboardStats {
  totalScans: number
  activeScanners: number
  threatsDetected: number
  systemsProtected: number
  uptime: number
  lastScanTime: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 1247,
    activeScanners: 8,
    threatsDetected: 156,
    systemsProtected: 42,
    uptime: 99.97,
    lastScanTime: new Date().toISOString(),
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      type: "scan",
      target: "192.168.1.0/24",
      result: "24 hosts discovered",
      time: "2 minutes ago",
      status: "completed",
    },
    {
      type: "threat",
      threat: "Port scan detected",
      source: "185.220.101.32",
      time: "5 minutes ago",
      status: "blocked",
    },
    {
      type: "alert",
      message: "New vulnerability CVE-2024-0123",
      severity: "high",
      time: "12 minutes ago",
      status: "new",
    },
    {
      type: "scan",
      target: "api.company.com",
      result: "3 vulnerabilities found",
      time: "28 minutes ago",
      status: "completed",
    },
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeScanners: Math.max(0, prev.activeScanners + Math.floor((Math.random() - 0.5) * 3)),
        threatsDetected: prev.threatsDetected + Math.floor(Math.random() * 2),
        lastScanTime: new Date().toISOString(),
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const refreshDashboard = () => {
    // Simulate data refresh
    setStats((prev) => ({ ...prev, lastScanTime: new Date().toISOString() }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time security monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={refreshDashboard}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Scans</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {stats.totalScans.toLocaleString()}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="mt-2 flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-blue-600">+8% this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Scanners</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.activeScanners}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="mt-2 flex items-center text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-green-600">Live monitoring</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Threats Detected</p>
                  <p className="text-3xl font-bold text-red-700 dark:text-red-300">{stats.threatsDetected}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="mt-2 flex items-center text-xs">
                <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
                <span className="text-red-600">+12% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Systems Protected</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.systemsProtected}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="mt-2 flex items-center text-xs">
                <Clock className="h-3 w-3 text-purple-600 mr-1" />
                <span className="text-purple-600">{stats.uptime}% uptime</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Threats
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Security Metrics */}
              <div className="lg:col-span-2">
                <SecurityMetrics />
              </div>

              {/* Recent Activity */}
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest security events and scans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {activity.type === "scan" && <Target className="h-4 w-4 text-blue-600" />}
                          {activity.type === "threat" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          {activity.type === "alert" && <Eye className="h-4 w-4 text-orange-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.type === "scan" && `Scan: ${activity.target}`}
                            {activity.type === "threat" && activity.threat}
                            {activity.type === "alert" && activity.message}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            {activity.result || activity.source || activity.severity} • {activity.time}
                          </div>
                        </div>
                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "default"
                              : activity.status === "blocked"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Scanner Engine</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Threat Intelligence</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Database</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">CPU Usage</span>
                        <span className="font-medium">34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Memory</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Storage</span>
                        <span className="font-medium">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.uptime}%</div>
                      <div className="text-sm text-green-600 dark:text-green-400">System Uptime</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner">
            <NetworkScanner />
          </TabsContent>

          <TabsContent value="threats">
            <ThreatIntelligence />
          </TabsContent>

          <TabsContent value="reports">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Security Reports
                </CardTitle>
                <CardDescription>Generate and download comprehensive security reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Reports Dashboard</h3>
                  <p>Comprehensive security reporting and analytics coming soon.</p>
                  <Button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600">Request Early Access</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
