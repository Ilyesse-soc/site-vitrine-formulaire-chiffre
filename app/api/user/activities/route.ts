import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth-utils"
import { getLoginLogsByUser } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = verifyAccessToken(token)

    if (!user) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 })
    }

    // Récupération des activités de l'utilisateur
    const activities = await getLoginLogsByUser(user._id)

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 10), // Limiter aux 10 dernières activités
    })
  } catch (error) {
    console.error("[USER ACTIVITIES ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
