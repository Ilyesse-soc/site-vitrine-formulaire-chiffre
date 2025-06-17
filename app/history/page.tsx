"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, History, ArrowLeft, Calendar, Globe, Shield } from "lucide-react"
import Link from "next/link"

interface HistoryEntry {
  _id: string
  target: string
  ip: string
  hostname?: string
  scanTime: string
  userIp: string
  userAgent?: string
  portsCount: number
  ports: Array<{
    port: number
    protocol: string
    service: string
    state: string
  }>
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedScan, setSelectedScan] = useState<HistoryEntry | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement de l'historique")
      }

      setHistory(data.history)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getServiceBadgeColor = (service: string) => {
    const colors: Record<string, string> = {
      http: "bg-blue-100 text-blue-800",
      https: "bg-green-100 text-green-800",
      ssh: "bg-purple-100 text-purple-800",
      ftp: "bg-orange-100 text-orange-800",
      smtp: "bg-yellow-100 text-yellow-800",
      dns: "bg-indigo-100 text-indigo-800",
      mysql: "bg-red-100 text-red-800",
      unknown: "bg-gray-100 text-gray-800",
    }
    return colors[service.toLowerCase()] || colors["unknown"]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <History className="h-6 w-6" />
                Historique des scans
              </h1>
              <p className="text-gray-600">Consultez tous les audits de sécurité effectués</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique complet
            </CardTitle>
            <CardDescription>{history.length} scan(s) enregistré(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Aucun scan n'a encore été effectué.
                  <Link href="/" className="ml-1 text-blue-600 hover:underline">
                    Lancez votre premier scan
                  </Link>
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Ports ouverts</TableHead>
                    <TableHead>IP Utilisateur</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry._id}>
                      <TableCell className="font-mono text-sm">{formatDate(entry.scanTime)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{entry.target}</span>
                          {entry.hostname && (
                            <Badge variant="outline" className="text-xs">
                              {entry.hostname}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{entry.ip}</TableCell>
                      <TableCell>
                        <Badge
                          variant={entry.portsCount > 0 ? "default" : "secondary"}
                          className={entry.portsCount > 0 ? "bg-green-100 text-green-800" : ""}
                        >
                          {entry.portsCount} port(s)
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{entry.userIp}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setSelectedScan(entry)}>
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Scan Details Modal */}
        {selectedScan && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Détails du scan
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedScan(null)}>
                  Fermer
                </Button>
              </div>
              <CardDescription>
                Scan de {selectedScan.target} ({selectedScan.ip}) - {formatDate(selectedScan.scanTime)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">IP Utilisateur:</span>
                    <span className="ml-2 font-mono">{selectedScan.userIp}</span>
                  </div>
                  {selectedScan.userAgent && (
                    <div>
                      <span className="font-medium text-gray-700">User-Agent:</span>
                      <span className="ml-2 text-gray-600 truncate">{selectedScan.userAgent}</span>
                    </div>
                  )}
                </div>

                {selectedScan.ports.length === 0 ? (
                  <Alert>
                    <AlertDescription>Aucun port ouvert détecté lors de ce scan.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <h4 className="font-medium">Ports ouverts détectés:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Port</TableHead>
                          <TableHead>Protocole</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>État</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedScan.ports.map((port, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{port.port}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{port.protocol.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getServiceBadgeColor(port.service)}>{port.service}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={port.state === "open" ? "default" : "secondary"}
                                className={port.state === "open" ? "bg-green-100 text-green-800" : ""}
                              >
                                {port.state}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
