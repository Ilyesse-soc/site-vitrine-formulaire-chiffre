import { type NextRequest, NextResponse } from "next/server"
import { validateEmail, generatePasswordResetToken } from "@/lib/auth-utils"
import { findUserByEmail, createPasswordResetToken } from "@/lib/database"
import { sendPasswordResetEmail } from "@/lib/email-service"
import { rateLimiter } from "@/lib/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validation des inputs
    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    }

    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const clientIp = userIp.split(",")[0].trim()

    // Rate limiting pour éviter le spam
    const rateLimitResult = await rateLimiter.check(clientIp, "forgot-password")
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: `Trop de demandes. Réessayez dans ${rateLimitResult.resetTime} secondes.` },
        { status: 429 },
      )
    }

    const normalizedEmail = email.toLowerCase()

    // Recherche de l'utilisateur
    const user = await findUserByEmail(normalizedEmail)

    // Pour des raisons de sécurité, on renvoie toujours le même message
    // même si l'utilisateur n'existe pas
    if (!user) {
      console.log(`[AUTH] Tentative de reset pour email inexistant: ${normalizedEmail}`)
      return NextResponse.json({
        success: true,
        message: "Si un compte existe avec cette adresse, vous recevrez un email de réinitialisation.",
      })
    }

    // Génération du token de réinitialisation
    const resetToken = generatePasswordResetToken()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

    // Sauvegarde du token en base
    await createPasswordResetToken({
      userId: user._id,
      token: resetToken,
      expiresAt: expiresAt.toISOString(),
      used: false,
    })

    // Envoi de l'email de réinitialisation
    await sendPasswordResetEmail(user.email, resetToken)

    console.log(`[AUTH] Token de réinitialisation généré pour: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: "Si un compte existe avec cette adresse, vous recevrez un email de réinitialisation.",
    })
  } catch (error) {
    console.error("[AUTH FORGOT PASSWORD ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
