"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Lock,
  Code,
  Database,
  Cloud,
  Mail,
  Phone,
  MapPin,
  Activity,
  Target,
  Eye,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/hooks/use-theme"
import { SecurityMetrics } from "@/components/security-metrics"
import { NetworkScanner } from "@/components/network-scanner"
import { ThreatIntelligence } from "@/components/threat-intelligence"
import { ContactForm } from "@/components/contact-form"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CyberSec Pro
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">Advanced Security Platform</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#scanner" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Scanner
              </a>
              <a
                href="#intelligence"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
              >
                Intelligence
              </a>
              <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors">
                Contact
              </a>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? "🌞" : "🌙"}
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
              <div className="space-y-6">
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
                  <Zap className="h-3 w-3 mr-1" />
                  Powered by AI & Machine Learning
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Next-Gen{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Cybersecurity
                  </span>{" "}
                  Platform
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Advanced network scanning, threat intelligence, and real-time security monitoring powered by AI.
                  Protect your infrastructure with enterprise-grade security tools.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Start Free Scan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-2">
                  <a href="#demo">Watch Demo</a>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">50M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Threats Detected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Detection Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Monitoring</div>
                </div>
              </div>
            </div>
            <div className={`relative ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}>
              <SecurityMetrics />
            </div>
          </div>
        </div>
      </section>

      {/* Network Scanner Section */}
      <section id="scanner" className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 mb-4">
              <Target className="h-3 w-3 mr-1" />
              Advanced Network Scanner
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Real-Time Network Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover vulnerabilities, open ports, and security risks across your network infrastructure with our
              AI-powered scanning engine.
            </p>
          </div>
          <NetworkScanner />
        </div>
      </section>

      {/* Threat Intelligence Section */}
      <section id="intelligence" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 mb-4">
              <Eye className="h-3 w-3 mr-1" />
              Threat Intelligence
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Global Threat Monitoring
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stay ahead of emerging threats with real-time intelligence from our global network of security sensors and
              AI analysis.
            </p>
          </div>
          <ThreatIntelligence />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 mb-4">
              <Star className="h-3 w-3 mr-1" />
              Our Services
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Comprehensive Security Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From penetration testing to incident response, we provide end-to-end cybersecurity services for modern
              enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Penetration Testing",
                description: "Comprehensive security assessments to identify vulnerabilities before attackers do.",
                features: ["Web App Testing", "Network Penetration", "Social Engineering"],
                color: "blue",
                price: "Starting at $2,999",
              },
              {
                icon: Activity,
                title: "SOC as a Service",
                description: "24/7 security operations center monitoring and incident response.",
                features: ["Real-time Monitoring", "Threat Hunting", "Incident Response"],
                color: "green",
                price: "Starting at $1,499/mo",
              },
              {
                icon: Code,
                title: "Secure Development",
                description: "DevSecOps integration and secure code review services.",
                features: ["SAST/DAST", "Code Review", "Security Training"],
                color: "purple",
                price: "Starting at $4,999",
              },
              {
                icon: Cloud,
                title: "Cloud Security",
                description: "Comprehensive cloud infrastructure security assessment and monitoring.",
                features: ["AWS/Azure/GCP", "CSPM", "Cloud Migration"],
                color: "orange",
                price: "Starting at $3,499",
              },
              {
                icon: Database,
                title: "Data Protection",
                description: "Advanced data loss prevention and privacy compliance solutions.",
                features: ["DLP Solutions", "GDPR Compliance", "Data Encryption"],
                color: "red",
                price: "Starting at $2,299",
              },
              {
                icon: Users,
                title: "Security Training",
                description: "Comprehensive cybersecurity awareness and technical training programs.",
                features: ["Phishing Simulation", "Security Awareness", "Technical Training"],
                color: "indigo",
                price: "Starting at $1,999",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div
                    className={`p-4 bg-${service.color}-100 dark:bg-${service.color}-900/30 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className={`h-8 w-8 text-${service.color}-600 dark:text-${service.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{service.price}</span>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 mb-4">
              <Mail className="h-3 w-3 mr-1" />
              Get In Touch
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Secure Your Infrastructure?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Contact our security experts for a free consultation and discover how we can protect your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Headquarters</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        123 Cyber Security Blvd
                        <br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">24/7 Emergency</h4>
                      <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                      <p className="text-gray-600 dark:text-gray-300">security@cybersecpro.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Business Hours</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Mon - Fri: 9:00 AM - 6:00 PM PST
                        <br />
                        Emergency Support: 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Enterprise Security</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  All communications are encrypted with military-grade AES-256 encryption. Our form uses advanced
                  anti-spam protection and zero-knowledge architecture.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">CyberSec Pro</span>
                  <div className="text-xs text-gray-400">Advanced Security Platform</div>
                </div>
              </div>
              <p className="text-gray-400">
                Next-generation cybersecurity platform powered by AI and machine learning for comprehensive threat
                protection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Penetration Testing</li>
                <li>SOC as a Service</li>
                <li>Cloud Security</li>
                <li>Incident Response</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Partners</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Blog</li>
                <li>Whitepapers</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 CyberSec Pro. All rights reserved. SOC 2 Type II Certified.</p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <CheckCircle className="h-3 w-3 mr-1" />
                ISO 27001
              </Badge>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Shield className="h-3 w-3 mr-1" />
                SOC 2 Type II
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
