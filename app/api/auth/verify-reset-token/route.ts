import { type NextRequest, NextResponse } from "next/server"
import { findPasswordResetToken } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token requis" }, { status: 400 })
    }

    // Recherche du token de réinitialisation
    const resetToken = await findPasswordResetToken(token)

    if (!resetToken) {
      return NextResponse.json({ error: "Token invalide" }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ error: "Ce token a déjà été utilisé" }, { status: 400 })
    }

    if (new Date(resetToken.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Token expiré" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Token valide",
    })
  } catch (error) {
    console.error("[AUTH VERIFY RESET TOKEN ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
