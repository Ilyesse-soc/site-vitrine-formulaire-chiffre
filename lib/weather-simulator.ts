/**
 * Simulateur d'API météo OpenWeather
 * En production, utilisez la vraie API OpenWeather
 */

interface WeatherData {
  city: string
  country: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

// Base de données de villes avec données météo simulées
const weatherDatabase: Record<string, WeatherData> = {
  paris: {
    city: "Paris",
    country: "FR",
    temperature: 15,
    description: "Nuageux",
    humidity: 65,
    windSpeed: 12,
    icon: "04d",
  },
  london: {
    city: "London",
    country: "GB",
    temperature: 12,
    description: "Pluie légère",
    humidity: 78,
    windSpeed: 8,
    icon: "10d",
  },
  "new york": {
    city: "New York",
    country: "US",
    temperature: 18,
    description: "Ensoleillé",
    humidity: 45,
    windSpeed: 15,
    icon: "01d",
  },
  tokyo: {
    city: "Tokyo",
    country: "JP",
    temperature: 22,
    description: "Partiellement nuageux",
    humidity: 60,
    windSpeed: 10,
    icon: "02d",
  },
  sydney: {
    city: "Sydney",
    country: "AU",
    temperature: 25,
    description: "Ensoleillé",
    humidity: 55,
    windSpeed: 18,
    icon: "01d",
  },
  berlin: {
    city: "Berlin",
    country: "DE",
    temperature: 8,
    description: "Couvert",
    humidity: 72,
    windSpeed: 6,
    icon: "04d",
  },
  madrid: {
    city: "Madrid",
    country: "ES",
    temperature: 20,
    description: "Ensoleillé",
    humidity: 40,
    windSpeed: 14,
    icon: "01d",
  },
  rome: {
    city: "Rome",
    country: "IT",
    temperature: 17,
    description: "Nuageux",
    humidity: 68,
    windSpeed: 9,
    icon: "03d",
  },
}

const weatherDescriptions = [
  "Ensoleillé",
  "Partiellement nuageux",
  "Nuageux",
  "Couvert",
  "Pluie légère",
  "Pluie",
  "Orage",
  "Brouillard",
]

export async function simulateWeatherAPI(city: string): Promise<WeatherData | null> {
  // Simulation du délai d'API
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))

  const normalizedCity = city.toLowerCase().trim()

  // Vérifier si la ville est dans notre base de données
  if (weatherDatabase[normalizedCity]) {
    const weather = { ...weatherDatabase[normalizedCity] }
    // Ajouter une petite variation aléatoire
    weather.temperature += Math.floor(Math.random() * 6) - 3
    weather.humidity += Math.floor(Math.random() * 20) - 10
    weather.windSpeed += Math.floor(Math.random() * 10) - 5

    // S'assurer que les valeurs restent dans des limites réalistes
    weather.humidity = Math.max(0, Math.min(100, weather.humidity))
    weather.windSpeed = Math.max(0, weather.windSpeed)

    return weather
  }

  // Pour les villes inconnues, générer des données aléatoires
  if (normalizedCity.length > 2) {
    return {
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      country: "XX",
      temperature: Math.floor(Math.random() * 35) - 5, // -5°C à 30°C
      description: weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)],
      humidity: Math.floor(Math.random() * 60) + 30, // 30% à 90%
      windSpeed: Math.floor(Math.random() * 25) + 5, // 5 à 30 km/h
      icon: "01d",
    }
  }

  // En production avec l'API OpenWeather :
  /*
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
  const OPENWEATHER_URL = `https://api.openweathermap.org/data/2.5/weather`
  
  try {
    const response = await fetch(
      `${OPENWEATHER_URL}?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
    )
    
    if (!response.ok) {
      if (response.status === 404) {
        return null // Ville non trouvée
      }
      throw new Error(`API Error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s vers km/h
      icon: data.weather[0].icon
    }
  } catch (error) {
    console.error('[WEATHER API ERROR]', error)
    throw new Error('Erreur lors de la récupération des données météo')
  }
  */

  return null // Ville non trouvée
}
