import { type NextRequest, NextResponse } from "next/server"
import { validateTarget, sanitizeInput } from "@/lib/security"
import { saveScanResult } from "@/lib/database"
import { simulateNmapScan } from "@/lib/nmap-simulator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { target } = body

    // Validation des inputs
    if (!target || typeof target !== "string") {
      return NextResponse.json({ error: "Cible manquante ou invalide" }, { status: 400 })
    }

    const sanitizedTarget = sanitizeInput(target)

    if (!validateTarget(sanitizedTarget)) {
      return NextResponse.json(
        { error: "Format de cible invalide. Utilisez une IP valide ou un nom de domaine." },
        { status: 400 },
      )
    }

    // Récupération des informations utilisateur
    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"
    const userAgent = request.headers.get("user-agent") || "Unknown"

    // Log de sécurité
    console.log(`[SCAN REQUEST] Target: ${sanitizedTarget}, User IP: ${userIp}, Time: ${new Date().toISOString()}`)

    // Simulation du scan Nmap (en production, utilisez subprocess avec Python)
    const scanResult = await simulateNmapScan(sanitizedTarget)

    // Sauvegarde en base de données
    await saveScanResult({
      target: sanitizedTarget,
      ip: scanResult.ip,
      hostname: scanResult.hostname,
      ports: scanResult.ports,
      userIp: userIp.split(",")[0].trim(), // Premier IP si plusieurs
      userAgent,
      scanTime: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      result: scanResult,
    })
  } catch (error) {
    console.error("[SCAN ERROR]", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
