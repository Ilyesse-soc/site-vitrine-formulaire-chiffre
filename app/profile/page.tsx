"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, User, Shield, Activity, Save, ArrowLeft, Crown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface UserProfile {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  createdAt: string
  lastLogin?: string
  emailVerified: boolean
  twoFactorEnabled: boolean
}

interface LoginActivity {
  _id: string
  ip: string
  userAgent: string
  timestamp: string
  success: boolean
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<LoginActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
      return
    }

    if (user) {
      fetchProfile()
      fetchActivities()
    }
  }, [user, authLoading, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data.profile)
      } else {
        setError(data.error || "Erreur lors du chargement du profil")
      }
    } catch (err) {
      setError("Erreur lors du chargement du profil")
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/user/activities", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setActivities(data.activities)
      }
    } catch (err) {
      console.error("Erreur lors du chargement des activités")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async (formData: { firstName: string; lastName: string }) => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data.profile)
        setSuccess("Profil mis à jour avec succès")
      } else {
        setError(data.error || "Erreur lors de la mise à jour")
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour")
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-red-600" />
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-600" />
      default:
        return <User className="h-4 w-4 text-green-600" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "moderator":
        return "default"
      default:
        return "secondary"
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Erreur lors du chargement du profil</p>
              <Button asChild className="mt-4">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>
                    {profile.firstName} {profile.lastName}
                  </CardTitle>
                  <CardDescription>{profile.email}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getRoleIcon(profile.role)}
                <Badge variant={getRoleBadgeVariant(profile.role)}>{profile.role}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Membre depuis:</span>
                <p className="text-gray-600">{new Date(profile.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Dernière connexion:</span>
                <p className="text-gray-600">
                  {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString("fr-FR") : "Jamais"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email vérifié:</span>
                <p className="text-gray-600">
                  <Badge variant={profile.emailVerified ? "default" : "secondary"}>
                    {profile.emailVerified ? "Vérifié" : "Non vérifié"}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Informations</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm profile={profile} onSave={handleSaveProfile} isSaving={isSaving} />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings profile={profile} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog activities={activities} />
          </TabsContent>
        </Tabs>

        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

function ProfileForm({
  profile,
  onSave,
  isSaving,
}: {
  profile: UserProfile
  onSave: (data: { firstName: string; lastName: string }) => void
  isSaving: boolean
}) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
        <CardDescription>Modifiez vos informations personnelles</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile.email} disabled />
            <p className="text-xs text-gray-600">L'email ne peut pas être modifié</p>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function SecuritySettings({ profile }: { profile: UserProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de sécurité</CardTitle>
        <CardDescription>Gérez la sécurité de votre compte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Authentification à deux facteurs</h4>
            <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
          </div>
          <Badge variant={profile.twoFactorEnabled ? "default" : "secondary"}>
            {profile.twoFactorEnabled ? "Activée" : "Désactivée"}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Changer le mot de passe</h4>
            <p className="text-sm text-gray-600">Mettez à jour votre mot de passe</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/auth/change-password">Modifier</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Sessions actives</h4>
            <p className="text-sm text-gray-600">Gérez vos sessions de connexion</p>
          </div>
          <Button variant="outline">Voir les sessions</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityLog({ activities }: { activities: LoginActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activité de connexion
        </CardTitle>
        <CardDescription>Historique de vos connexions récentes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Aucune activité récente</p>
          ) : (
            activities.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.success ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div>
                    <p className="text-sm font-medium">
                      {activity.success ? "Connexion réussie" : "Tentative de connexion échouée"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {activity.ip} • {new Date(activity.timestamp).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
                <Badge variant={activity.success ? "default" : "destructive"}>
                  {activity.success ? "Succès" : "Échec"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
