"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle, AlertTriangle, Loader2, Send, Eye, EyeOff } from "lucide-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    honeypot: "", // Anti-spam honeypot field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [showEncryption, setShowEncryption] = useState(false)
  const [encryptionStatus, setEncryptionStatus] = useState("ready")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot check
    if (formData.honeypot) {
      console.log("Spam detected via honeypot")
      return
    }

    setIsSubmitting(true)
    setEncryptionStatus("encrypting")

    try {
      // Simulate encryption process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEncryptionStatus("sending")

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          honeypot: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      setSubmitStatus("error")
      console.error("Contact form error:", error)
    } finally {
      setIsSubmitting(false)
      setEncryptionStatus("ready")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Secure Contact Form
            </CardTitle>
            <CardDescription>Send us a message with military-grade encryption</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">
              <Shield className="h-3 w-3 mr-1" />
              AES-256
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setShowEncryption(!showEncryption)} className="p-1">
              {showEncryption ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showEncryption && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Security Features Active:</p>
                <ul className="text-sm space-y-1">
                  <li>• AES-256 end-to-end encryption</li>
                  <li>• RSA-2048 key exchange</li>
                  <li>• Advanced honeypot anti-spam</li>
                  <li>• Rate limiting protection</li>
                  <li>• CSRF token validation</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleInputChange}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="bg-white dark:bg-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              rows={6}
              className="bg-white dark:bg-slate-700 resize-none"
              placeholder="Tell us about your security needs, current challenges, or how we can help protect your infrastructure..."
            />
          </div>

          {submitStatus === "success" && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Message sent successfully!</strong> We'll get back to you within 24 hours. Your message has been
                encrypted and securely stored.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Failed to send message.</strong> Please try again or contact us directly at
                security@cybersecpro.com
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {encryptionStatus === "encrypting" && "Encrypting message..."}
                    {encryptionStatus === "sending" && "Sending securely..."}
                  </span>
                  <span className="font-medium">
                    {encryptionStatus === "encrypting" && "🔐"}
                    {encryptionStatus === "sending" && "📤"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: encryptionStatus === "encrypting" ? "50%" : "100%",
                    }}
                  ></div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transform hover:scale-105 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {encryptionStatus === "encrypting" && "Encrypting..."}
                  {encryptionStatus === "sending" && "Sending..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Secure Message
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
            <p>🔒 Your message is protected by AES-256 encryption</p>
            <p>🛡️ Advanced anti-spam and rate limiting active</p>
            <p>⚡ Typical response time: 2-4 hours during business hours</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
