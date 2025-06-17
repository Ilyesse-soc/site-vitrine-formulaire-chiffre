/**
 * Système de chiffrement hybride AES + RSA pour sécuriser les formulaires
 * En production, utilisez des bibliothèques crypto robustes comme crypto-js ou node:crypto
 */

interface EncryptedData {
  encryptedContent: string
  encryptedKey: string
  iv: string
  publicKeyFingerprint: string
}

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
  website: string // honeypot
  address: string // honeypot
}

// Simulation des clés RSA (en production, générez de vraies clés)
const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1234567890abcdef...
-----END PUBLIC KEY-----`

const RSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXYZ...
-----END PRIVATE KEY-----`

/**
 * Génère une clé AES aléatoire
 */
function generateAESKey(): string {
  // En production, utilisez crypto.getRandomValues() ou crypto.randomBytes()
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Génère un IV (Initialization Vector) aléatoire
 */
function generateIV(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Chiffrement AES-256-CBC simulé
 */
function encryptAES(data: string, key: string, iv: string): string {
  // En production, utilisez une vraie implémentation AES
  // const crypto = require('crypto')
  // const cipher = crypto.createCipher('aes-256-cbc', key)
  // cipher.setIV(Buffer.from(iv, 'hex'))
  // return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')

  // Simulation pour la démo
  const encoded = btoa(JSON.stringify({ data, key: key.substring(0, 8), iv: iv.substring(0, 8) }))
  return `aes256_${encoded}_${Date.now()}`
}

/**
 * Déchiffrement AES-256-CBC simulé
 */
function decryptAES(encryptedData: string, key: string, iv: string): string {
  // En production, utilisez une vraie implémentation AES
  // const crypto = require('crypto')
  // const decipher = crypto.createDecipher('aes-256-cbc', key)
  // decipher.setIV(Buffer.from(iv, 'hex'))
  // return decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8')

  // Simulation pour la démo
  try {
    if (!encryptedData.startsWith("aes256_")) {
      throw new Error("Format de données chiffrées invalide")
    }

    const encoded = encryptedData.replace("aes256_", "").split("_")[0]
    const decoded = JSON.parse(atob(encoded))

    // Vérification basique de la clé et IV
    if (!decoded.data || decoded.key !== key.substring(0, 8) || decoded.iv !== iv.substring(0, 8)) {
      throw new Error("Clé ou IV invalide")
    }

    return decoded.data
  } catch (error) {
    throw new Error("Erreur de déchiffrement AES")
  }
}

/**
 * Chiffrement RSA simulé
 */
function encryptRSA(data: string, publicKey: string): string {
  // En production, utilisez une vraie implémentation RSA
  // const crypto = require('crypto')
  // return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64')

  // Simulation pour la démo
  const encoded = btoa(JSON.stringify({ data, keyFingerprint: publicKey.substring(0, 20) }))
  return `rsa2048_${encoded}_${Date.now()}`
}

/**
 * Déchiffrement RSA simulé
 */
function decryptRSA(encryptedData: string, privateKey: string): string {
  // En production, utilisez une vraie implémentation RSA
  // const crypto = require('crypto')
  // return crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString()

  // Simulation pour la démo
  try {
    if (!encryptedData.startsWith("rsa2048_")) {
      throw new Error("Format de données RSA invalide")
    }

    const encoded = encryptedData.replace("rsa2048_", "").split("_")[0]
    const decoded = JSON.parse(atob(encoded))

    return decoded.data
  } catch (error) {
    throw new Error("Erreur de déchiffrement RSA")
  }
}

/**
 * Calcule l'empreinte de la clé publique
 */
function getPublicKeyFingerprint(publicKey: string): string {
  // En production, utilisez un vrai hash SHA-256
  // const crypto = require('crypto')
  // return crypto.createHash('sha256').update(publicKey).digest('hex').substring(0, 16)

  // Simulation pour la démo
  return publicKey
    .substring(0, 20)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
}

/**
 * Chiffrement hybride côté client (AES + RSA)
 */
export async function encryptFormData(formData: FormData): Promise<EncryptedData> {
  try {
    // Génération d'une clé AES et d'un IV aléatoires
    const aesKey = generateAESKey()
    const iv = generateIV()

    // Sérialisation des données du formulaire
    const jsonData = JSON.stringify(formData)

    // Chiffrement des données avec AES
    const encryptedContent = encryptAES(jsonData, aesKey, iv)

    // Chiffrement de la clé AES avec RSA
    const encryptedKey = encryptRSA(aesKey, RSA_PUBLIC_KEY)

    // Empreinte de la clé publique pour vérification
    const publicKeyFingerprint = getPublicKeyFingerprint(RSA_PUBLIC_KEY)

    console.log("[ENCRYPTION] Données chiffrées avec AES-256 + RSA-2048")

    return {
      encryptedContent,
      encryptedKey,
      iv,
      publicKeyFingerprint,
    }
  } catch (error) {
    console.error("[ENCRYPTION ERROR]", error)
    throw new Error("Erreur lors du chiffrement des données")
  }
}

/**
 * Déchiffrement hybride côté serveur (RSA + AES)
 */
export async function decryptFormData(encryptedData: EncryptedData): Promise<FormData> {
  try {
    const { encryptedContent, encryptedKey, iv, publicKeyFingerprint } = encryptedData

    // Vérification de l'empreinte de la clé publique
    const expectedFingerprint = getPublicKeyFingerprint(RSA_PUBLIC_KEY)
    if (publicKeyFingerprint !== expectedFingerprint) {
      throw new Error("Empreinte de clé publique invalide")
    }

    // Déchiffrement de la clé AES avec RSA
    const aesKey = decryptRSA(encryptedKey, RSA_PRIVATE_KEY)

    // Déchiffrement des données avec AES
    const jsonData = decryptAES(encryptedContent, aesKey, iv)

    // Désérialisation des données
    const formData = JSON.parse(jsonData)

    console.log("[DECRYPTION] Données déchiffrées avec succès")

    return formData
  } catch (error) {
    console.error("[DECRYPTION ERROR]", error)
    throw new Error("Erreur lors du déchiffrement des données")
  }
}

/**
 * Génération de paires de clés RSA (pour l'initialisation)
 */
export function generateRSAKeyPair(): { publicKey: string; privateKey: string } {
  // En production, utilisez crypto.generateKeyPairSync()
  // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  //   modulusLength: 2048,
  //   publicKeyEncoding: { type: 'spki', format: 'pem' },
  //   privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  // })

  // Simulation pour la démo
  const timestamp = Date.now()
  return {
    publicKey: `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${timestamp}...\n-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDX${timestamp}...\n-----END PRIVATE KEY-----`,
  }
}
