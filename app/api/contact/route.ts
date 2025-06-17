import { type NextRequest, NextResponse } from "next/server"
import { decryptFormData } from "@/lib/encryption"
import { validateContactForm, detectSpam } from "@/lib/security"
import { saveContactMessage, createSecurityLog } from "@/lib/database"
import { sendContactNotification } from "@/lib/email-service"
import { rateLimiter } from "@/lib/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { encryptedData, timestamp } = body

    // Récupération des informations client
    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"
    const clientIp = userIp.split(",")[0].trim()

    // Rate limiting
    const rateLimitResult = await rateLimiter.check(clientIp, "contact")
    if (!rateLimitResult.success) {
      await createSecurityLog({
        type: "contact_form",
        ip: clientIp,
        userAgent,
        details: `Rate limit exceeded: ${rateLimitResult.resetTime}s remaining`,
        severity: "medium",
      })

      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${rateLimitResult.resetTime} secondes.` },
        { status: 429 },
      )
    }

    // Vérification de la fraîcheur du timestamp (protection contre les attaques de replay)
    const now = Date.now()
    if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
      // 5 minutes
      await createSecurityLog({
        type: "contact_form",
        ip: clientIp,
        userAgent,
        details: "Timestamp validation failed - possible replay attack",
        severity: "high",
      })

      return NextResponse.json({ error: "Requête expirée. Veuillez réessayer." }, { status: 400 })
    }

    // Déchiffrement des données
    let formData
    try {
      formData = await decryptFormData(encryptedData)
    } catch (error) {
      await createSecurityLog({
        type: "encryption_error",
        ip: clientIp,
        userAgent,
        details: "Failed to decrypt form data",
        severity: "high",
      })

      return NextResponse.json({ error: "Erreur de déchiffrement des données" }, { status: 400 })
    }

    // Validation des données
    const validation = validateContactForm(formData)
    if (!validation.isValid) {
      await createSecurityLog({
        type: "contact_form",
        ip: clientIp,
        userAgent,
        details: `Form validation failed: ${validation.errors.join(", ")}`,
        severity: "low",
      })

      return NextResponse.json({ error: validation.errors[0] }, { status: 400 })
    }

    // Détection de spam
    const spamCheck = detectSpam(formData, clientIp, userAgent)
    if (spamCheck.isSpam) {
      await createSecurityLog({
        type: "spam_attempt",
        ip: clientIp,
        userAgent,
        details: `Spam detected: ${spamCheck.reasons.join(", ")}`,
        severity: "medium",
      })

      // On sauvegarde quand même le message mais marqué comme spam
      await saveContactMessage({
        ...formData,
        ip: clientIp,
        userAgent,
        isSpam: true,
        spamReasons: spamCheck.reasons,
      })

      return NextResponse.json({ error: "Message détecté comme spam" }, { status: 400 })
    }

    // Sauvegarde du message
    const savedMessage = await saveContactMessage({
      ...formData,
      ip: clientIp,
      userAgent,
      isSpam: false,
    })

    // Envoi de notification par email
    await sendContactNotification(savedMessage)

    // Log de sécurité pour message valide
    await createSecurityLog({
      type: "contact_form",
      ip: clientIp,
      userAgent,
      details: `Valid contact form submitted by ${formData.email}`,
      severity: "low",
    })

    console.log(`[CONTACT] Message reçu de ${formData.email} (${clientIp})`)

    return NextResponse.json({
      success: true,
      message: "Message envoyé avec succès",
      messageId: savedMessage._id,
    })
  } catch (error) {
    console.error("[CONTACT ERROR]", error)

    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    await createSecurityLog({
      type: "contact_form",
      ip: userIp.split(",")[0].trim(),
      userAgent,
      details: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      severity: "high",
    })

    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
