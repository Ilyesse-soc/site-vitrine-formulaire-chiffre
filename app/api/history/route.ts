import { NextResponse } from "next/server"
import { getScanHistory } from "@/lib/database"

export async function GET() {
  try {
    const history = await getScanHistory()

    return NextResponse.json({
      success: true,
      history,
    })
  } catch (error) {
    console.error("[HISTORY ERROR]", error)
    return NextResponse.json({ error: "Erreur lors du chargement de l'historique" }, { status: 500 })
  }
}
