"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Shield, Mail, Eye, Trash2, Download, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ContactMessage {
  _id: string
  name: string
  email: string
  company?: string
  phone?: string
  subject?: string
  message: string
  timestamp: string
  ip: string
  userAgent: string
  status: "new" | "read" | "replied"
  isSpam: boolean
}

interface SecurityLog {
  _id: string
  type: "contact_form" | "spam_attempt" | "encryption_error"
  ip: string
  userAgent: string
  timestamp: string
  details: string
  severity: "low" | "medium" | "high"
}

export default function AdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [messagesResponse, logsResponse] = await Promise.all([
        fetch("/api/admin/messages"),
        fetch("/api/admin/security-logs"),
      ])

      const messagesData = await messagesResponse.json()
      const logsData = await logsResponse.json()

      if (messagesResponse.ok) {
        setMessages(messagesData.messages)
      }

      if (logsResponse.ok) {
        setSecurityLogs(logsData.logs)
      }
    } catch (err) {
      setError("Erreur lors du chargement des données")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/read`, {
        method: "PUT",
      })

      if (response.ok) {
        setMessages(messages.map((msg) => (msg._id === messageId ? { ...msg, status: "read" } : msg)))
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut")
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== messageId))
        setSelectedMessage(null)
      }
    } catch (err) {
      console.error("Erreur lors de la suppression")
    }
  }

  const exportMessages = () => {
    const csvContent = [
      ["Date", "Nom", "Email", "Entreprise", "Sujet", "Message", "Statut"].join(","),
      ...messages.map((msg) =>
        [
          new Date(msg.timestamp).toLocaleString("fr-FR"),
          msg.name,
          msg.email,
          msg.company || "",
          msg.subject || "",
          `"${msg.message.replace(/"/g, '""')}"`,
          msg.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `messages_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="destructive">Nouveau</Badge>
      case "read":
        return <Badge variant="default">Lu</Badge>
      case "replied":
        return <Badge variant="secondary">Répondu</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Élevé</Badge>
      case "medium":
        return <Badge variant="default">Moyen</Badge>
      case "low":
        return <Badge variant="secondary">Faible</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au site
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                Administration SecureTech
              </h1>
              <p className="text-gray-600">Gestion des messages et sécurité</p>
            </div>
          </div>
          <Button onClick={exportMessages} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages totaux</p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                  <p className="text-2xl font-bold text-red-600">{messages.filter((m) => m.status === "new").length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Spam bloqué</p>
                  <p className="text-2xl font-bold text-orange-600">{messages.filter((m) => m.isSpam).length}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Logs sécurité</p>
                  <p className="text-2xl font-bold text-purple-600">{securityLogs.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">Messages de contact</TabsTrigger>
            <TabsTrigger value="security">Logs de sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages de contact</CardTitle>
                    <CardDescription>Cliquez sur un message pour voir les détails</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Sujet</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow
                            key={message._id}
                            className={`cursor-pointer hover:bg-gray-50 ${selectedMessage?._id === message._id ? "bg-blue-50" : ""}`}
                            onClick={() => {
                              setSelectedMessage(message)
                              if (message.status === "new") {
                                markAsRead(message._id)
                              }
                            }}
                          >
                            <TableCell className="text-sm">
                              {new Date(message.timestamp).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell className="font-medium">{message.name}</TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell className="max-w-xs truncate">{message.subject || "Sans sujet"}</TableCell>
                            <TableCell>{getStatusBadge(message.status)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedMessage(message)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteMessage(message._id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Message Details */}
              <div>
                {selectedMessage ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Détails du message
                        {selectedMessage.isSpam && <Badge variant="destructive">SPAM</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700">Informations</h4>
                        <div className="mt-2 space-y-2 text-sm">
                          <p>
                            <strong>Nom:</strong> {selectedMessage.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedMessage.email}
                          </p>
                          {selectedMessage.company && (
                            <p>
                              <strong>Entreprise:</strong> {selectedMessage.company}
                            </p>
                          )}
                          {selectedMessage.phone && (
                            <p>
                              <strong>Téléphone:</strong> {selectedMessage.phone}
                            </p>
                          )}
                          <p>
                            <strong>Date:</strong> {new Date(selectedMessage.timestamp).toLocaleString("fr-FR")}
                          </p>
                          <p>
                            <strong>IP:</strong> {selectedMessage.ip}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700">Sujet</h4>
                        <p className="mt-2 text-sm">{selectedMessage.subject || "Sans sujet"}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700">Message</h4>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">
                          {selectedMessage.message}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => (window.location.href = `mailto:${selectedMessage.email}`)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Répondre
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteMessage(selectedMessage._id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Sélectionnez un message pour voir les détails</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Logs de sécurité</CardTitle>
                <CardDescription>Historique des événements de sécurité</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>Sévérité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(log.timestamp).toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.type.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">{log.ip}</TableCell>
                        <TableCell className="max-w-md truncate">{log.details}</TableCell>
                        <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
