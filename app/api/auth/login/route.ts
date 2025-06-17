import { type NextRequest, NextResponse } from "next/server"
import { validateEmail, comparePassword, generateTokens } from "@/lib/auth-utils"
import { findUserByEmail, createLoginLog, updateUserLastLogin } from "@/lib/database"
import { rateLimiter } from "@/lib/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    // Validation des inputs
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    }

    // Récupération des informations de connexion
    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"
    const clientIp = userIp.split(",")[0].trim()

    // Rate limiting
    const rateLimitResult = await rateLimiter.check(clientIp, "login")
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${rateLimitResult.resetTime} secondes.` },
        { status: 429 },
      )
    }

    // Recherche de l'utilisateur
    const user = await findUserByEmail(email.toLowerCase())

    if (!user) {
      // Log de tentative de connexion échouée
      await createLoginLog({
        userId: "unknown",
        userEmail: email,
        ip: clientIp,
        userAgent,
        success: false,
        reason: "User not found",
      })

      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérification du mot de passe
    const isValidPassword = await comparePassword(password, user.passwordHash)

    if (!isValidPassword) {
      // Log de tentative de connexion échouée
      await createLoginLog({
        userId: user._id,
        userEmail: user.email,
        ip: clientIp,
        userAgent,
        success: false,
        reason: "Invalid password",
      })

      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérification si le compte est actif
    if (!user.isActive) {
      await createLoginLog({
        userId: user._id,
        userEmail: user.email,
        ip: clientIp,
        userAgent,
        success: false,
        reason: "Account disabled",
      })

      return NextResponse.json({ error: "Compte désactivé. Contactez l'administrateur." }, { status: 403 })
    }

    // Génération des tokens JWT
    const { accessToken, refreshToken } = generateTokens(user, rememberMe)

    // Sauvegarde du refresh token
    await createRefreshToken(user._id, refreshToken, clientIp, userAgent)

    // Log de connexion réussie
    await createLoginLog({
      userId: user._id,
      userEmail: user.email,
      ip: clientIp,
      userAgent,
      success: true,
      reason: "Successful login",
    })

    // Mise à jour de la dernière connexion
    await updateUserLastLogin(user._id)

    console.log(`[AUTH] Connexion réussie: ${user.email} (${clientIp})`)

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        lastLogin: new Date().toISOString(),
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    console.error("[AUTH LOGIN ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

async function createRefreshToken(userId: string, token: string, ip: string, userAgent: string) {
  // En production, stockez les refresh tokens en base de données
  console.log(`[AUTH] Refresh token créé pour l'utilisateur ${userId}`)
}
