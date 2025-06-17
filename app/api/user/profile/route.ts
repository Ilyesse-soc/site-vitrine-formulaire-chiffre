import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth-utils"
import { findUserById, updateUserProfile } from "@/lib/database"

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

    // Récupération du profil complet
    const profile = await findUserById(user._id)

    if (!profile) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profile: {
        _id: profile._id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        createdAt: profile.createdAt,
        lastLogin: profile.lastLogin,
        emailVerified: profile.emailVerified,
        twoFactorEnabled: profile.twoFactorEnabled,
      },
    })
  } catch (error) {
    console.error("[USER PROFILE ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { firstName, lastName } = body

    // Validation des inputs
    if (!firstName || !lastName) {
      return NextResponse.json({ error: "Prénom et nom requis" }, { status: 400 })
    }

    // Mise à jour du profil
    const updatedProfile = await updateUserProfile(user._id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    })

    if (!updatedProfile) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    console.log(`[USER] Profil mis à jour pour: ${user.email}`)

    return NextResponse.json({
      success: true,
      profile: {
        _id: updatedProfile._id,
        email: updatedProfile.email,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        role: updatedProfile.role,
        createdAt: updatedProfile.createdAt,
        lastLogin: updatedProfile.lastLogin,
        emailVerified: updatedProfile.emailVerified,
        twoFactorEnabled: updatedProfile.twoFactorEnabled,
      },
    })
  } catch (error) {
    console.error("[USER PROFILE UPDATE ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
