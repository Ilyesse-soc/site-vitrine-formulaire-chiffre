/**
 * Simulation de base de données pour les messages de contact et logs de sécurité
 */

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
  spamReasons?: string[]
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

// Simulation des collections
const contactMessages: ContactMessage[] = [
  {
    _id: "msg_1",
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    company: "TechCorp",
    phone: "+33 1 23 45 67 89",
    subject: "Demande de devis",
    message:
      "Bonjour, je souhaiterais obtenir un devis pour le développement d'une application web sécurisée pour notre entreprise. Nous avons besoin d'une solution complète avec authentification et gestion des utilisateurs.",
    timestamp: "2024-01-15T10:30:00.000Z",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    status: "new",
    isSpam: false,
  },
  {
    _id: "msg_2",
    name: "Marie Martin",
    email: "marie.martin@startup.fr",
    company: "StartupInnovante",
    subject: "Consultation cybersécurité",
    message:
      "Nous recherchons un partenaire pour auditer la sécurité de notre infrastructure. Pouvez-vous nous proposer vos services ?",
    timestamp: "2024-01-15T09:15:00.000Z",
    ip: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    status: "read",
    isSpam: false,
  },
  {
    _id: "msg_3",
    name: "Spam Bot",
    email: "spam@tempmail.org",
    subject: "URGENT: You won $1,000,000!!!",
    message:
      "Congratulations! You have won $1,000,000 in our lottery! Click here to claim your prize: http://suspicious-site.com",
    timestamp: "2024-01-15T08:00:00.000Z",
    ip: "10.0.0.1",
    userAgent: "curl/7.68.0",
    status: "new",
    isSpam: true,
    spamReasons: [
      "Honeypot fields filled",
      "Suspicious keywords: lottery, winner, congratulations",
      "Disposable email domain",
    ],
  },
]

const securityLogs: SecurityLog[] = [
  {
    _id: "log_1",
    type: "contact_form",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    timestamp: "2024-01-15T10:30:00.000Z",
    details: "Valid contact form submitted by jean.dupont@email.com",
    severity: "low",
  },
  {
    _id: "log_2",
    type: "spam_attempt",
    ip: "10.0.0.1",
    userAgent: "curl/7.68.0",
    timestamp: "2024-01-15T08:00:00.000Z",
    details: "Spam detected: Honeypot fields filled, Suspicious keywords: lottery, winner",
    severity: "medium",
  },
  {
    _id: "log_3",
    type: "contact_form",
    ip: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36",
    timestamp: "2024-01-15T07:30:00.000Z",
    details: "Rate limit exceeded: 45s remaining",
    severity: "medium",
  },
]

// Fonctions de base de données

export async function saveContactMessage(
  messageData: Omit<ContactMessage, "_id" | "timestamp" | "status">,
): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    _id: `msg_${Date.now()}`,
    ...messageData,
    timestamp: new Date().toISOString(),
    status: "new",
  }

  contactMessages.unshift(newMessage) // Ajoute au début
  console.log(`[DB] Message de contact sauvegardé: ${newMessage.email} (${newMessage.isSpam ? "SPAM" : "VALIDE"})`)
  return newMessage
}

export async function getAllContactMessages(): Promise<ContactMessage[]> {
  return [...contactMessages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function markMessageAsRead(messageId: string): Promise<ContactMessage | null> {
  const message = contactMessages.find((msg) => msg._id === messageId)
  if (message) {
    message.status = "read"
    console.log(`[DB] Message marqué comme lu: ${messageId}`)
    return message
  }
  return null
}

export async function deleteContactMessage(messageId: string): Promise<ContactMessage | null> {
  const messageIndex = contactMessages.findIndex((msg) => msg._id === messageId)
  if (messageIndex === -1) return null

  const deletedMessage = contactMessages[messageIndex]
  contactMessages.splice(messageIndex, 1)
  console.log(`[DB] Message supprimé: ${messageId}`)
  return deletedMessage
}

export async function createSecurityLog(logData: Omit<SecurityLog, "_id" | "timestamp">): Promise<SecurityLog> {
  const newLog: SecurityLog = {
    _id: `log_${Date.now()}`,
    ...logData,
    timestamp: new Date().toISOString(),
  }

  securityLogs.unshift(newLog) // Ajoute au début
  console.log(`[DB] Log de sécurité créé: ${newLog.type} (${newLog.severity})`)
  return newLog
}

export async function getAllSecurityLogs(): Promise<SecurityLog[]> {
  return [...securityLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function getSecurityLogsByType(type: SecurityLog["type"]): Promise<SecurityLog[]> {
  return securityLogs.filter((log) => log.type === type)
}

export async function getSecurityLogsBySeverity(severity: SecurityLog["severity"]): Promise<SecurityLog[]> {
  return securityLogs.filter((log) => log.severity === severity)
}

// Statistiques
export async function getContactStats(): Promise<{
  total: number
  new: number
  read: number
  replied: number
  spam: number
  today: number
}> {
  const today = new Date().toISOString().split("T")[0]

  return {
    total: contactMessages.length,
    new: contactMessages.filter((msg) => msg.status === "new").length,
    read: contactMessages.filter((msg) => msg.status === "read").length,
    replied: contactMessages.filter((msg) => msg.status === "replied").length,
    spam: contactMessages.filter((msg) => msg.isSpam).length,
    today: contactMessages.filter((msg) => msg.timestamp.startsWith(today)).length,
  }
}

export async function getSecurityStats(): Promise<{
  total: number
  today: number
  byType: Record<string, number>
  bySeverity: Record<string, number>
}> {
  const today = new Date().toISOString().split("T")[0]

  const byType: Record<string, number> = {}
  const bySeverity: Record<string, number> = {}

  for (const log of securityLogs) {
    byType[log.type] = (byType[log.type] || 0) + 1
    bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1
  }

  return {
    total: securityLogs.length,
    today: securityLogs.filter((log) => log.timestamp.startsWith(today)).length,
    byType,
    bySeverity,
  }
}
