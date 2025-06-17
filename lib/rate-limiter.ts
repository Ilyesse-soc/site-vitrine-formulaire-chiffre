/**
 * Rate limiter pour prévenir les attaques par déni de service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map()
  private limits = {
    contact: { maxAttempts: 3, windowMs: 10 * 60 * 1000 }, // 3 messages par 10 minutes
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 tentatives par 15 minutes
    "forgot-password": { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 tentatives par heure
  }

  async check(identifier: string, action: keyof typeof this.limits): Promise<{ success: boolean; resetTime?: number }> {
    const key = `${action}:${identifier}`
    const limit = this.limits[action]
    const now = Date.now()

    let entry = this.attempts.get(key)

    // Si pas d'entrée ou si la fenêtre est expirée, créer une nouvelle entrée
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + limit.windowMs,
      }
      this.attempts.set(key, entry)
      return { success: true }
    }

    // Incrémenter le compteur
    entry.count++

    // Vérifier si la limite est dépassée
    if (entry.count > limit.maxAttempts) {
      const resetTime = Math.ceil((entry.resetTime - now) / 1000)
      return { success: false, resetTime }
    }

    return { success: true }
  }

  // Nettoyer les entrées expirées
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key)
      }
    }
  }

  // Obtenir les statistiques
  getStats(): { totalEntries: number; activeEntries: number } {
    const now = Date.now()
    const activeEntries = Array.from(this.attempts.values()).filter((entry) => now <= entry.resetTime).length

    return {
      totalEntries: this.attempts.size,
      activeEntries,
    }
  }
}

export const rateLimiter = new RateLimiter()

// Nettoyer les entrées expirées toutes les heures
setInterval(
  () => {
    rateLimiter.cleanup()
  },
  60 * 60 * 1000,
)
