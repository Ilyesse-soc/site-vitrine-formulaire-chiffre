/**
 * Fonctions de sécurité pour validation et détection de spam
 */

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
  website: string // honeypot
  address: string // honeypot
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

interface SpamCheckResult {
  isSpam: boolean
  reasons: string[]
  score: number
}

/**
 * Validation stricte des données du formulaire
 */
export function validateContactForm(formData: FormData): ValidationResult {
  const errors: string[] = []

  // Validation des champs obligatoires
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push("Le nom doit contenir au moins 2 caractères")
  }

  if (!formData.email || !isValidEmail(formData.email)) {
    errors.push("Format d'email invalide")
  }

  if (!formData.message || formData.message.trim().length < 10) {
    errors.push("Le message doit contenir au moins 10 caractères")
  }

  // Validation des longueurs maximales
  if (formData.name.length > 100) {
    errors.push("Le nom ne peut pas dépasser 100 caractères")
  }

  if (formData.email.length > 255) {
    errors.push("L'email ne peut pas dépasser 255 caractères")
  }

  if (formData.company && formData.company.length > 100) {
    errors.push("Le nom de l'entreprise ne peut pas dépasser 100 caractères")
  }

  if (formData.phone && formData.phone.length > 20) {
    errors.push("Le numéro de téléphone ne peut pas dépasser 20 caractères")
  }

  if (formData.subject && formData.subject.length > 200) {
    errors.push("Le sujet ne peut pas dépasser 200 caractères")
  }

  if (formData.message.length > 5000) {
    errors.push("Le message ne peut pas dépasser 5000 caractères")
  }

  // Validation des caractères dangereux
  const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /<iframe/i, /<object/i, /<embed/i]

  const allFields = [
    formData.name,
    formData.email,
    formData.company,
    formData.phone,
    formData.subject,
    formData.message,
  ]

  for (const field of allFields) {
    if (field) {
      for (const pattern of dangerousPatterns) {
        if (pattern.test(field)) {
          errors.push("Contenu potentiellement dangereux détecté")
          break
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Détection de spam avancée
 */
export function detectSpam(formData: FormData, ip: string, userAgent: string): SpamCheckResult {
  const reasons: string[] = []
  let score = 0

  // 1. Vérification honeypot (champs cachés)
  if (formData.website || formData.address) {
    reasons.push("Honeypot fields filled")
    score += 100 // Score maximum pour honeypot
  }

  // 2. Détection de contenu suspect
  const suspiciousKeywords = [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations",
    "click here",
    "free money",
    "make money",
    "work from home",
    "bitcoin",
    "cryptocurrency",
    "investment opportunity",
    "nigerian prince",
    "inheritance",
    "million dollars",
  ]

  const content =
    `${formData.name} ${formData.email} ${formData.company} ${formData.subject} ${formData.message}`.toLowerCase()

  for (const keyword of suspiciousKeywords) {
    if (content.includes(keyword)) {
      reasons.push(`Suspicious keyword: ${keyword}`)
      score += 20
    }
  }

  // 3. Détection de liens suspects
  const urlPattern = /https?:\/\/[^\s]+/gi
  const urls = content.match(urlPattern) || []

  if (urls.length > 3) {
    reasons.push("Too many URLs")
    score += 30
  }

  // 4. Détection de répétition excessive
  const words = formData.message.toLowerCase().split(/\s+/)
  const wordCount = new Map<string, number>()

  for (const word of words) {
    if (word.length > 3) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    }
  }

  for (const [word, count] of wordCount.entries()) {
    if (count > 5) {
      reasons.push(`Excessive repetition: ${word}`)
      score += 15
    }
  }

  // 5. Détection de caractères non-ASCII suspects
  const nonAsciiRatio = (content.length - content.replace(/[^\x00-\x7F]/g, "").length) / content.length
  if (nonAsciiRatio > 0.3) {
    reasons.push("High non-ASCII character ratio")
    score += 25
  }

  // 6. Détection d'email jetable
  const disposableEmailDomains = [
    "10minutemail.com",
    "tempmail.org",
    "guerrillamail.com",
    "mailinator.com",
    "yopmail.com",
    "temp-mail.org",
  ]

  const emailDomain = formData.email.split("@")[1]?.toLowerCase()
  if (emailDomain && disposableEmailDomains.includes(emailDomain)) {
    reasons.push("Disposable email domain")
    score += 40
  }

  // 7. Détection de User-Agent suspect
  const suspiciousUserAgents = ["curl", "wget", "python", "bot", "crawler", "spider"]

  for (const suspicious of suspiciousUserAgents) {
    if (userAgent.toLowerCase().includes(suspicious)) {
      reasons.push(`Suspicious user agent: ${suspicious}`)
      score += 35
    }
  }

  // 8. Détection de message trop court ou trop générique
  if (formData.message.length < 20) {
    reasons.push("Message too short")
    score += 10
  }

  const genericMessages = ["hello", "hi", "test", "testing", "check", "spam"]

  if (genericMessages.includes(formData.message.toLowerCase().trim())) {
    reasons.push("Generic message")
    score += 25
  }

  // 9. Détection de format de nom suspect
  if (!/^[a-zA-ZÀ-ÿ\s\-'.]+$/.test(formData.name)) {
    reasons.push("Suspicious name format")
    score += 15
  }

  // 10. Détection d'IP suspecte (simulation)
  const suspiciousIPs = ["127.0.0.1", "0.0.0.0", "192.168.", "10.0.", "172.16."]

  for (const suspiciousIP of suspiciousIPs) {
    if (ip.startsWith(suspiciousIP)) {
      reasons.push(`Suspicious IP range: ${suspiciousIP}`)
      score += 20
      break
    }
  }

  return {
    isSpam: score >= 50, // Seuil de détection de spam
    reasons,
    score,
  }
}

/**
 * Validation d'email robuste
 */
function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegex.test(email)) {
    return false
  }

  // Vérifications supplémentaires
  const parts = email.split("@")
  if (parts.length !== 2) {
    return false
  }

  const [localPart, domain] = parts

  // Vérification de la partie locale
  if (localPart.length > 64 || localPart.length === 0) {
    return false
  }

  // Vérification du domaine
  if (domain.length > 253 || domain.length === 0) {
    return false
  }

  // Vérification des points consécutifs
  if (email.includes("..")) {
    return false
  }

  return true
}

/**
 * Nettoyage et sanitisation des données
 */
export function sanitizeFormData(formData: FormData): FormData {
  return {
    name: sanitizeString(formData.name),
    email: sanitizeEmail(formData.email),
    company: sanitizeString(formData.company),
    phone: sanitizePhone(formData.phone),
    subject: sanitizeString(formData.subject),
    message: sanitizeMessage(formData.message),
    website: "", // Toujours vider les honeypots
    address: "", // Toujours vider les honeypots
  }
}

function sanitizeString(input: string): string {
  if (!input) return ""

  return input
    .trim()
    .replace(/[<>]/g, "") // Supprime les chevrons
    .replace(/javascript:/gi, "") // Supprime javascript:
    .replace(/on\w+\s*=/gi, "") // Supprime les event handlers
    .substring(0, 1000) // Limite la longueur
}

function sanitizeEmail(email: string): string {
  if (!email) return ""

  return email.trim().toLowerCase().replace(/[<>]/g, "").substring(0, 255)
}

function sanitizePhone(phone: string): string {
  if (!phone) return ""

  return phone
    .trim()
    .replace(/[^\d\s+\-$$$$.]/g, "") // Garde seulement les caractères de téléphone
    .substring(0, 20)
}

function sanitizeMessage(message: string): string {
  if (!message) return ""

  return message
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Supprime les scripts
    .replace(/<[^>]*>/g, "") // Supprime toutes les balises HTML
    .substring(0, 5000)
}
