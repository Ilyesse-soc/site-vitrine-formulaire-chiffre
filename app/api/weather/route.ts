import { type NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth-utils"
import { simulateWeatherAPI } from "@/lib/weather-simulator"

export async function POST(request: NextRequest) {
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
    const { city } = body

    if (!city || typeof city !== "string") {
      return NextResponse.json({ error: "Nom de ville requis" }, { status: 400 })
    }

    const sanitizedCity = city.trim()
    if (sanitizedCity.length === 0) {
      return NextResponse.json({ error: "Nom de ville invalide" }, { status: 400 })
    }

    // Simulation de l'appel à l'API OpenWeather
    const weather = await simulateWeatherAPI(sanitizedCity)

    if (!weather) {
      return NextResponse.json({ error: "Ville non trouvée" }, { status: 404 })
    }

    console.log(`[WEATHER] Recherche météo: ${sanitizedCity} par ${user.email}`)

    return NextResponse.json({
      success: true,
      weather,
    })
  } catch (error) {
    console.error("[WEATHER ERROR]", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des données météo" }, { status: 500 })
  }
}
