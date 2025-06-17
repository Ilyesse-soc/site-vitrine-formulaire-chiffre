"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Scan,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Download,
  History,
  Settings,
  Play,
  Pause,
} from "lucide-react"

interface ScanResult {
  ip: string
  hostname?: string
  ports: Array<{
    port: number
    protocol: string
    service: string
    state: string
    version?: string
    vulnerability?: string
  }>
  os?: string
  scanTime: string
  riskLevel: "low" | "medium" | "high" | "critical"
}

export function NetworkScanner() {
  const [target, setTarget] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState<ScanResult | null>(null)
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([])
  const [error, setError] = useState("")
  const [scanType, setScanType] = useState("quick")

  const handleScan = async () => {
    if (!target) {
      setError("Please enter a target IP or domain")
      return
    }

    setIsScanning(true)
    setError("")
    setScanProgress(0)
    setScanResults(null)

    try {
      // Simulate scan progress
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + Math.random() * 15
        })
      }, 500)

      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      setScanProgress(100)

      // Mock scan result
      const mockResult: ScanResult = {
        ip: target.includes(".") ? target : "192.168.1.100",
        hostname: target.includes(".") ? undefined : "example-host.local",
        ports: [
          {
            port: 22,
            protocol: "tcp",
            service: "ssh",
            state: "open",
            version: "OpenSSH 8.2",
            vulnerability: "CVE-2024-0001 - Weak encryption",
          },
          {
            port: 80,
            protocol: "tcp",
            service: "http",
            state: "open",
            version: "Apache 2.4.41",
          },
          {
            port: 443,
            protocol: "tcp",
            service: "https",
            state: "open",
            version: "Apache 2.4.41 (SSL)",
          },
          {
            port: 3306,
            protocol: "tcp",
            service: "mysql",
            state: "open",
            version: "MySQL 8.0.25",
            vulnerability: "Weak password policy detected",
          },
        ],
        os: "Linux Ubuntu 20.04",
        scanTime: new Date().toISOString(),
        riskLevel: "high",
      }

      setScanResults(mockResult)
      setScanHistory((prev) => [mockResult, ...prev.slice(0, 9)])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed")
    } finally {
      setIsScanning(false)
      setTimeout(() => setScanProgress(0), 2000)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "high":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20"
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  const getServiceIcon = (service: string) => {
    const icons: Record<string, string> = {
      http: "🌐",
      https: "🔒",
      ssh: "🔑",
      ftp: "📁",
      smtp: "✉️",
      dns: "🌍",
      mysql: "🗄️",
      unknown: "❓",
    }
    return icons[service.toLowerCase()] || icons.unknown
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="scanner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          {/* Scanner Input */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Network Scanner
              </CardTitle>
              <CardDescription>Advanced port scanning and vulnerability detection powered by AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="target">Target (IP or Domain)</Label>
                  <Input
                    id="target"
                    placeholder="192.168.1.1 or example.com"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    disabled={isScanning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scanType">Scan Type</Label>
                  <select
                    id="scanType"
                    value={scanType}
                    onChange={(e) => setScanType(e.target.value)}
                    disabled={isScanning}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700"
                  >
                    <option value="quick">Quick Scan</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="stealth">Stealth Mode</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              {isScanning && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Scanning progress</span>
                    <span className="font-medium">{scanProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Discovering hosts and analyzing ports...</p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleScan}
                  disabled={isScanning || !target}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Scan
                    </>
                  )}
                </Button>
                {isScanning && (
                  <Button variant="outline" onClick={() => setIsScanning(false)}>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop
                  </Button>
                )}
                {scanResults && (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scan Results */}
          {scanResults && (
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Scan Results - {scanResults.ip}
                  </CardTitle>
                  <Badge className={getRiskColor(scanResults.riskLevel)}>
                    {scanResults.riskLevel.toUpperCase()} RISK
                  </Badge>
                </div>
                <CardDescription>
                  Found {scanResults.ports.length} open ports • Scanned{" "}
                  {new Date(scanResults.scanTime).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Host Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">IP Address</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{scanResults.ip}</p>
                    </div>
                    {scanResults.hostname && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Hostname</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{scanResults.hostname}</p>
                      </div>
                    )}
                    {scanResults.os && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">Operating System</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{scanResults.os}</p>
                      </div>
                    )}
                  </div>

                  {/* Open Ports */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Open Ports & Services</h4>
                    <div className="grid gap-3">
                      {scanResults.ports.map((port, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{getServiceIcon(port.service)}</div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  Port {port.port}/{port.protocol}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {port.service}
                                </Badge>
                                {port.state === "open" && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Open
                                  </Badge>
                                )}
                              </div>
                              {port.version && (
                                <p className="text-sm text-gray-600 dark:text-gray-300">{port.version}</p>
                              )}
                              {port.vulnerability && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                  <span className="text-sm text-red-600 dark:text-red-400">{port.vulnerability}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Scan History
              </CardTitle>
              <CardDescription>Recent network scans and results</CardDescription>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No scan history available. Start your first scan!
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((scan, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      onClick={() => setScanResults(scan)}
                    >
                      <div className="flex items-center gap-4">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{scan.ip}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {scan.ports.length} ports • {new Date(scan.scanTime).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getRiskColor(scan.riskLevel)}>{scan.riskLevel.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Scanner Settings
              </CardTitle>
              <CardDescription>Configure scanning parameters and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Scan Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Timeout (seconds)</span>
                      <Input type="number" defaultValue="30" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Max concurrent scans</span>
                      <Input type="number" defaultValue="100" className="w-20" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Delay between requests (ms)</span>
                      <Input type="number" defaultValue="10" className="w-20" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Detection Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">OS Detection</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Service Version Detection</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Vulnerability Scanning</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Aggressive Scanning</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
