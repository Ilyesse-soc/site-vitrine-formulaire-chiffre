"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const token = localStorage.getItem("accessToken")
    if (token) {
      // Vérifier la validité du token
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser({
          _id: data.profile._id,
          email: data.profile.email,
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          role: data.profile.role,
          lastLogin: data.profile.lastLogin,
        })
      } else {
        // Token invalide, essayer de le rafraîchir
        await tryRefreshToken()
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      logout()
      return
    }

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("accessToken", data.accessToken)
        localStorage.setItem("refreshToken", data.refreshToken)
        // Réessayer de vérifier le nouveau token
        await verifyToken(data.accessToken)
      } else {
        logout()
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error)
      logout()
    }
  }

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
