

👨‍💻 Auteur
Développé avec passion par Ilyesse El Adaoui

# 🛡️ Site Vitrine Sécurisé avec Formulaire Chiffré

![Secure Contact Form](https://raw.githubusercontent.com/ilyesse-soc/assets/main/secure-contact-banner.png)

## 📌 Présentation du Projet

Ce site vitrine professionnel permet aux entreprises de présenter leurs services tout en offrant un **formulaire de contact sécurisé**. Il intègre des technologies de chiffrement **AES/RSA** pour protéger les données envoyées par les utilisateurs, ainsi qu’un **système anti-spam honeypot** pour éviter les envois automatisés.

> 🔒 Projet codé par **Ilyesse El Adaoui**

---

## 🚀 Fonctionnalités

✅ Formulaire de contact sécurisé par chiffrement  
✅ Système anti-spam avec champ honeypot invisible  
✅ Sauvegarde en base MongoDB  
✅ Envoi des données déchiffrées côté serveur  
✅ Notifications côté utilisateur (formulaire bien envoyé / erreurs)  
✅ Design moderne et responsive

---

## 🧠 Architecture Technique

| Côté | Stack utilisée |
|------|----------------|
| **Frontend** | React, Tailwind CSS |
| **Backend**  | Node.js, Express |
| **Chiffrement** | AES + RSA via CryptoJS |
| **Base de données** | MongoDB (Mongoose) |
| **Sécurité** | Validation des entrées, CORS, Helmet |

---

## 🔐 Sécurité du Formulaire

- **Chiffrement côté client** avec AES pour les messages
- **Chiffrement de la clé AES** via **RSA publique** embarquée dans le frontend
- **Déchiffrement** côté serveur avec la clé RSA privée
- Protection anti-bot via un **champ honeypot** caché
- Nettoyage des inputs et validation rigoureuse

---

## 🖥️ Aperçu visuel

![Demo Screenshot](https://raw.githubusercontent.com/ilyesse-soc/assets/main/form-demo.png)

---

## ⚙️ Lancer le projet en local

```bash
# Cloner le dépôt
git clone https://github.com/ilyesse-soc/secure-contact-website.git

# Accéder au projet
cd secure-contact-website

# Installer les dépendances côté client
cd frontend
npm install

# Lancer le frontend
npm run dev

# Dans un autre terminal : installer et lancer le backend
cd ../backend
npm install
npm run dev
