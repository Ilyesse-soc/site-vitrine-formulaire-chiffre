import { NextResponse } from "next/server"
import { getAllContactMessages } from "@/lib/database"

export async function GET() {
  try {
    const messages = await getAllContactMessages()

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error) {
    console.error("[ADMIN MESSAGES ERROR]", error)
    return NextResponse.json({ error: "Erreur lors du chargement des messages" }, { status: 500 })
  }
}
