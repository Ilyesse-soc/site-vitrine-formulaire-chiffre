/**
 * Utilitaires d'authentification JWT et sécurité
 */

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface JWTPayload {
  _id: string
  email: string
  role: string
  iat: number
  exp: number
}

// Clé secrète JWT (en production, utilisez une variable d'environnement)
const JWT_SECRET = "your-super-secret-jwt-key-change-in-production-2024"
const REFRESH_SECRET = "your-super-secret-refresh-key-change-in-production-2024"

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function hashPassword(password: string): Promise<string> {
  // En production, utilisez bcrypt
  // const bcrypt = require('bcrypt')
  // return await bcrypt.hash(password, 12)

  // Simulation pour la démo avec un hash plus complexe
  const salt = Math.random().toString(36).substring(2, 15)
  return `bcrypt_${salt}_${password}_${Date.now()}`
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  // En production, utilisez bcrypt
  // const bcrypt = require('bcrypt')
  // return await bcrypt.compare(password, hash)

  // Simulation pour la démo
  return hash.includes(password)
}

export function generateTokens(user: User, rememberMe = false): { accessToken: string; refreshToken: string } {
  // En production, utilisez jsonwebtoken
  // const jwt = require('jsonwebtoken')

  const accessPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
  }

  const refreshPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60), // 30 jours si "se souvenir", sinon 7 jours
  }

  // Simulation des tokens JWT
  const accessToken = `jwt_access_${btoa(JSON.stringify(accessPayload))}`
  const refreshToken = `jwt_refresh_${btoa(JSON.stringify(refreshPayload))}`

  return { accessToken, refreshToken }
}

export function verifyAccessToken(token: string): User | null {
  try {
    // En production, utilisez jsonwebtoken
    // const jwt = require('jsonwebtoken')
    // const decoded = jwt.verify(token, JWT_SECRET)

    // Simulation pour la démo
    if (!token.startsWith("jwt_access_")) return null

    const payload: JWTPayload = JSON.parse(atob(token.substring(11)))

    // Vérifier l'expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return {
      _id: payload._id,
      email: payload.email,
      firstName: "",
      lastName: "",
      role: payload.role,
    }
  } catch (error) {
    return null
  }
}

export function verifyRefreshToken(token: string): User | null {
  try {
    if (!token.startsWith("jwt_refresh_")) return null

    const payload: JWTPayload = JSON.parse(atob(token.substring(12)))

    // Vérifier l'expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return {
      _id: payload._id,
      email: payload.email,
      firstName: "",
      lastName: "",
      role: payload.role,
    }
  } catch (error) {
    return null
  }
}

export function generateEmailVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function generatePasswordResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function generateTwoFactorSecret(): string {
  // En production, utilisez speakeasy ou similar
  return Math.random().toString(36).substring(2, 15)
}

export function verifyTwoFactorToken(secret: string, token: string): boolean {
  // En production, utilisez speakeasy pour vérifier le token TOTP
  return token === "123456" // Simulation
}
