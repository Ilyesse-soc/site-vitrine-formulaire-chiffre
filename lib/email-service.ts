/**
 * Service d'envoi d'emails pour les notifications de contact
 */

interface ContactMessage {
  _id: string
  name: string
  email: string
  company?: string
  phone?: string
  subject?: string
  message: string
  timestamp: string
  ip: string
}

export async function sendContactNotification(message: ContactMessage): Promise<void> {
  // En production, utilisez un service d'email comme SendGrid, Mailgun, ou AWS SES
  console.log(`[EMAIL] Notification de nouveau message de contact`)
  console.log(`[EMAIL] De: ${message.name} <${message.email}>`)
  console.log(`[EMAIL] Sujet: ${message.subject || "Nouveau message de contact"}`)
  console.log(`[EMAIL] Message: ${message.message.substring(0, 100)}...`)

  // Simulation d'envoi d'email à l'équipe
  const emailContent = `
    Nouveau message de contact reçu sur SecureTech

    Informations du contact:
    - Nom: ${message.name}
    - Email: ${message.email}
    - Entreprise: ${message.company || "Non spécifiée"}
    - Téléphone: ${message.phone || "Non spécifié"}
    - Date: ${new Date(message.timestamp).toLocaleString("fr-FR")}
    - IP: ${message.ip}

    Sujet: ${message.subject || "Sans sujet"}

    Message:
    ${message.message}

    ---
    Répondre directement à: ${message.email}
    Voir dans l'admin: ${process.env.NEXT_PUBLIC_APP_URL}/admin
  `

  // En production, remplacez par un vrai service d'email
  /*
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const msg = {
    to: 'contact@securetech.fr',
    from: 'noreply@securetech.fr',
    subject: `Nouveau message de contact - ${message.name}`,
    text: emailContent,
    html: emailContent.replace(/\n/g, '<br>')
  }

  await sgMail.send(msg)
  */

  // Simulation d'envoi
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log(`[EMAIL] Notification envoyée avec succès`)
}

export async function sendAutoReply(email: string, name: string): Promise<void> {
  console.log(`[EMAIL] Envoi de réponse automatique à ${email}`)

  const autoReplyContent = `
    Bonjour ${name},

    Nous avons bien reçu votre message et vous remercions de nous avoir contactés.

    Notre équipe examine votre demande et vous répondra dans les plus brefs délais, généralement sous 24 heures ouvrées.

    En attendant, n'hésitez pas à consulter notre site web pour découvrir nos services et réalisations.

    Cordialement,
    L'équipe SecureTech

    ---
    SecureTech - Solutions technologiques innovantes
    Email: contact@securetech.fr
    Téléphone: +33 1 23 45 67 89
    Site web: https://securetech.fr
  `

  // En production, utilisez un vrai service d'email
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log(`[EMAIL] Réponse automatique envoyée à ${email}`)
}

export async function sendSpamAlert(spamDetails: {
  ip: string
  email: string
  reasons: string[]
  timestamp: string
}): Promise<void> {
  console.log(`[EMAIL] Alerte spam détecté`)

  const alertContent = `
    ALERTE SÉCURITÉ: Tentative de spam détectée

    Détails:
    - IP: ${spamDetails.ip}
    - Email: ${spamDetails.email}
    - Date: ${new Date(spamDetails.timestamp).toLocaleString("fr-FR")}
    - Raisons: ${spamDetails.reasons.join(", ")}

    Action recommandée: Vérifier les logs de sécurité et considérer le blocage de l'IP si nécessaire.

    Voir les logs: ${process.env.NEXT_PUBLIC_APP_URL}/admin
  `

  // En production, envoyez à l'équipe de sécurité
  await new Promise((resolve) => setTimeout(resolve, 300))
  console.log(`[EMAIL] Alerte spam envoyée à l'équipe de sécurité`)
}
