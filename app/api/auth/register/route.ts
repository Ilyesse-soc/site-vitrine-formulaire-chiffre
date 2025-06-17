import { type NextRequest, NextResponse } from "next/server"
import { validateEmail, hashPassword, generateEmailVerificationToken } from "@/lib/auth-utils"
import { findUserByEmail, createUser } from "@/lib/database"
import { sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password } = body

    // Validation des inputs
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
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

    const normalizedEmail = email.toLowerCase()

    // Vérification si l'utilisateur existe déjà
    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
      return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 })
    }

    // Hachage du mot de passe
    const passwordHash = await hashPassword(password)

    // Génération du token de vérification email
    const emailVerificationToken = generateEmailVerificationToken()

    // Création de l'utilisateur
    const newUser = await createUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "user", // Par défaut, les nouveaux utilisateurs sont des "user"
      emailVerificationToken,
      isActive: true,
      emailVerified: false,
      twoFactorEnabled: false,
    })

    // Envoi de l'email de vérification
    await sendVerificationEmail(newUser.email, emailVerificationToken)

    console.log(`[AUTH] Nouvel utilisateur créé: ${newUser.email}`)

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
      user: {
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("[AUTH REGISTER ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
