import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth-utils"
import { getAllUsers } from "@/lib/database"

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

    // Vérification des droits admin
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé - droits administrateur requis" }, { status: 403 })
    }

    const users = await getAllUsers()

    return NextResponse.json({
      success: true,
      users,
    })
  } catch (error) {
    console.error("[ADMIN USERS ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
