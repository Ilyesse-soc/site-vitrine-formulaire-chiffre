import { NextResponse } from "next/server"
import { getAllSecurityLogs } from "@/lib/database"

export async function GET() {
  try {
    const logs = await getAllSecurityLogs()

    return NextResponse.json({
      success: true,
      logs,
    })
  } catch (error) {
    console.error("[ADMIN SECURITY LOGS ERROR]", error)
    return NextResponse.json({ error: "Erreur lors du chargement des logs" }, { status: 500 })
  }
}
