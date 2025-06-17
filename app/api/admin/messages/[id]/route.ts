import { type NextRequest, NextResponse } from "next/server"
import { deleteContactMessage } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = params.id

    const deletedMessage = await deleteContactMessage(messageId)

    if (!deletedMessage) {
      return NextResponse.json({ error: "Message non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Message supprimé avec succès",
    })
  } catch (error) {
    console.error("[ADMIN DELETE MESSAGE ERROR]", error)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
