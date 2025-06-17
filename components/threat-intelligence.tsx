"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Eye,
  Globe,
  AlertTriangle,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Clock,
  MapPin,
  Activity,
  Filter,
  Search,
  Download,
} from "lucide-react"

interface ThreatData {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  source: string
  location: string
  timestamp: string
  description: string
  indicators: string[]
  affectedSystems: number
}

interface GlobalStats {
  totalThreats: number
  activeAttacks: number
  blockedIPs: number
  vulnerabilities: number
  threatsByRegion: { region: string; count: number; change: number }[]
  topThreats: { type: string; count: number; trend: string }[]
}

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<ThreatData[]>([
    {
      id: "threat_001",
      type: "Malware Campaign",
      severity: "critical",
      source: "185.220.101.32",
      location: "Russia",
      timestamp: "2024-01-15T14:30:00Z",
      description: "Advanced persistent threat targeting financial institutions",
      indicators: ["CVE-2024-0001", "Trojan.Win32.Banker", "C2: malicious-domain.com"],
      affectedSystems: 127,
    },
    {
      id: "threat_002",
      type: "DDoS Attack",
      severity: "high",
      source: "Multiple",
      location: "Global",
      timestamp: "2024-01-15T14:25:00Z",
      description: "Coordinated botnet attack against cloud infrastructure",
      indicators: ["UDP Flood", "Rate: 50Gbps", "Duration: 45min"],
      affectedSystems: 89,
    },
    {
      id: "threat_003",
      type: "Phishing Campaign",
      severity: "medium",
      source: "phishing-site.com",
      location: "China",
      timestamp: "2024-01-15T14:20:00Z",
      description: "Credential harvesting targeting remote workers",
      indicators: ["Fake Office365", "Email spoofing", "Social engineering"],
      affectedSystems: 34,
    },
  ])

  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalThreats: 1847,
    activeAttacks: 23,
    blockedIPs: 15432,
    vulnerabilities: 892,
    threatsByRegion: [
      { region: "North America", count: 45, change: -12 },
      { region: "Europe", count: 38, change: +8 },
      { region: "Asia Pacific", count: 67, change: +15 },
      { region: "Russia", count: 89, change: +23 },
      { region: "Other", count: 12, change: -3 },
    ],
    topThreats: [
      { type: "Malware", count: 234, trend: "up" },
      { type: "Phishing", count: 189, trend: "down" },
      { type: "DDoS", count: 156, trend: "up" },
      { type: "Ransomware", count: 98, trend: "stable" },
      { type: "APT", count: 67, trend: "up" },
    ],
  })

  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setGlobalStats((prev) => ({
        ...prev,
        activeAttacks: Math.max(0, prev.activeAttacks + Math.floor((Math.random() - 0.5) * 6)),
        totalThreats: prev.totalThreats + Math.floor(Math.random() * 3),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 border-orange-200"
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200"
    }
  }

  const getThreatIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      "Malware Campaign": <Zap className="h-4 w-4 text-red-600" />,
      "DDoS Attack": <Target className="h-4 w-4 text-orange-600" />,
      "Phishing Campaign": <Eye className="h-4 w-4 text-yellow-600" />,
      APT: <Shield className="h-4 w-4 text-purple-600" />,
    }
    return icons[type] || <AlertTriangle className="h-4 w-4 text-gray-600" />
  }

  const filteredThreats = filter === "all" ? threats : threats.filter((t) => t.severity === filter)

  return (
    <div className="max-w-7xl mx-auto">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="threats">Live Threats</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="feeds">Intel Feeds</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Global Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Threats</p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                      {globalStats.totalThreats.toLocaleString()}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">+12% from last hour</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Attacks</p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                      {globalStats.activeAttacks}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-orange-600">Live monitoring</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Blocked IPs</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                      {globalStats.blockedIPs.toLocaleString()}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+8% this week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">CVEs Tracked</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{globalStats.vulnerabilities}</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <Clock className="h-3 w-3 text-blue-600 mr-1" />
                  <span className="text-blue-600">Updated hourly</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Threats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Threats by Region
                </CardTitle>
                <CardDescription>Geographic distribution of current threats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {globalStats.threatsByRegion.map((region, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{region.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{region.count}</span>
                          <Badge variant="outline" className={region.change > 0 ? "text-red-600" : "text-green-600"}>
                            {region.change > 0 ? "+" : ""}
                            {region.change}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(region.count / 100) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Threat Types
                </CardTitle>
                <CardDescription>Most common attack vectors detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {globalStats.topThreats.map((threat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{threat.type}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{threat.count} incidents</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {threat.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                        {threat.trend === "down" && <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />}
                        {threat.trend === "stable" && <div className="w-4 h-0.5 bg-gray-400"></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          {/* Threat Filters */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <div className="flex gap-2">
                    {["all", "critical", "high", "medium", "low"].map((severity) => (
                      <Button
                        key={severity}
                        variant={filter === severity ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(severity)}
                        className="capitalize"
                      >
                        {severity}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Threats */}
          <div className="space-y-4">
            {filteredThreats.map((threat) => (
              <Card
                key={threat.id}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {getThreatIcon(threat.type)}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{threat.type}</h3>
                          <Badge className={getSeverityColor(threat.severity)}>{threat.severity.toUpperCase()}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{threat.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {threat.source}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {threat.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(threat.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{threat.affectedSystems}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Affected Systems</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Threat Indicators</h4>
                      <div className="flex flex-wrap gap-2">
                        {threat.indicators.map((indicator, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        Block Source
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Threat Analytics</CardTitle>
              <CardDescription>Advanced analytics and threat intelligence insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feeds">
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Intelligence Feeds</CardTitle>
              <CardDescription>External threat intelligence sources and feeds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Intelligence feeds integration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
