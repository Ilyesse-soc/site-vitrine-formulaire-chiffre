import { type NextRequest, NextResponse } from "next/server"
import { markMessageAsRead } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = params.id

    const updatedMessage = await markMessageAsRead(messageId)

    if (!updatedMessage) {
      return NextResponse.json({ error: "Message non trouvé" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: updatedMessage,
    })
  } catch (error) {
    console.error("[ADMIN MARK READ ERROR]", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}
