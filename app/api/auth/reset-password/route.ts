import { type NextRequest, NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth-utils"
import { findPasswordResetToken, updateUserPassword, markPasswordResetTokenAsUsed } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    // Validation des inputs
    if (!token || !password) {
      return NextResponse.json({ error: "Token et mot de passe requis" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 })
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre" },
        { status: 400 },
      )
    }

    // Recherche du token de réinitialisation
    const resetToken = await findPasswordResetToken(token)

    if (!resetToken) {
      return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 })
    }

    if (resetToken.used) {
      return NextResponse.json({ error: "Ce token a déjà été utilisé" }, { status: 400 })
    }

    if (new Date(resetToken.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Token expiré" }, { status: 400 })
    }

    // Hachage du nouveau mot de passe
    const passwordHash = await hashPassword(password)

    // Mise à jour du mot de passe
    await updateUserPassword(resetToken.userId, passwordHash)

    // Marquer le token comme utilisé
    await markPasswordResetTokenAsUsed(resetToken._id)

    console.log(`[AUTH] Mot de passe réinitialisé pour l'utilisateur: ${resetToken.userId}`)

    return NextResponse.json({
      success: true,
      message: "Mot de passe mis à jour avec succès",
    })
  } catch (error) {
    console.error("[AUTH RESET PASSWORD ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
