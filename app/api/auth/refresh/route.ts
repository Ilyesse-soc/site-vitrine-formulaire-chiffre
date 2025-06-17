import { type NextRequest, NextResponse } from "next/server"
import { verifyRefreshToken, generateTokens } from "@/lib/auth-utils"
import { findUserById, findRefreshToken, revokeRefreshToken } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token requis" }, { status: 400 })
    }

    // Vérification du refresh token
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Refresh token invalide ou expiré" }, { status: 401 })
    }

    // Vérification en base de données
    const storedToken = await findRefreshToken(refreshToken)
    if (!storedToken || storedToken.revoked) {
      return NextResponse.json({ error: "Refresh token révoqué" }, { status: 401 })
    }

    // Récupération de l'utilisateur
    const user = await findUserById(payload._id)
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Utilisateur non trouvé ou désactivé" }, { status: 401 })
    }

    // Révocation de l'ancien refresh token
    await revokeRefreshToken(refreshToken)

    // Génération de nouveaux tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user)

    // Sauvegarde du nouveau refresh token
    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"
    await createRefreshToken(user._id, newRefreshToken, userIp.split(",")[0].trim(), userAgent)

    console.log(`[AUTH] Tokens rafraîchis pour: ${user.email}`)

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error("[AUTH REFRESH ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

async function createRefreshToken(userId: string, token: string, ip: string, userAgent: string) {
  // En production, stockez les refresh tokens en base de données
  console.log(`[AUTH] Nouveau refresh token créé pour l'utilisateur ${userId}`)
}
