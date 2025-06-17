import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth-utils"
import { deleteUser } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const userId = params.id

    // Empêcher la suppression d'un admin
    const userToDelete = await deleteUser(userId)
    if (!userToDelete) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    if (userToDelete.role === "admin") {
      return NextResponse.json({ error: "Impossible de supprimer un administrateur" }, { status: 403 })
    }

    console.log(`[ADMIN] Utilisateur supprimé: ${userToDelete.email} par ${user.email}`)

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    })
  } catch (error) {
    console.error("[ADMIN DELETE USER ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
