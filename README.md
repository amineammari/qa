# EasyShop - E-commerce Prototype

Application prototype e-commerce minimale avec backend Express + SQLite et frontend React + Vite.

## 📋 Table des matières

- [Présentation](#présentation)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Comptes de test](#comptes-de-test)
- [API Endpoints](#api-endpoints)
- [Structure du projet](#structure-du-projet)
- [Tests](#tests)
- [Documentation](#documentation)

## 🎯 Présentation

EasyShop est une application prototype d'e-commerce développée pour démontrer les fonctionnalités de base :
- Authentification utilisateur (inscription, connexion)
- Catalogue de produits
- Panier d'achat
- Création de commandes

## 🏗️ Architecture

### Backend
- **Framework** : Express.js
- **Base de données** : SQLite (better-sqlite3)
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcrypt pour le hash des mots de passe

### Frontend
- **Framework** : React 18
- **Build tool** : Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router
- **HTTP Client** : Axios

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Git (optionnel)

### Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env (copier depuis env.example)
# Windows PowerShell:
Copy-Item env.example .env
# Linux/Mac:
cp env.example .env

# Initialiser la base de données avec les données de test
node init_db.js

# Démarrer le serveur (mode développement avec nodemon)
npm run dev

# Ou démarrer en mode production
npm start
```

Le backend sera accessible sur `http://localhost:4000`

### Frontend

```bash
# Ouvrir un nouveau terminal
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 💻 Utilisation

1. **Démarrer le backend** (terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

2. **Démarrer le frontend** (terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Ouvrir le navigateur** sur `http://localhost:5173`

4. **Se connecter** avec un des comptes de test (voir ci-dessous)

## 👤 Comptes de test

Les comptes suivants sont créés automatiquement lors de l'initialisation de la base de données :

| Email | Mot de passe | Nom |
|-------|--------------|-----|
| alice@example.com | Password1! | Alice Dupont |
| bob@example.com | Password2! | Bob Martin |
| charlie@example.com | Password3! | Charlie Roy |

## 📦 Produits de test

Trois produits sont disponibles par défaut :

1. **Casque Audio** - 129.00€
   - Casque bluetooth circum-aural

2. **Clavier Mécanique** - 89.00€
   - Clavier AZERTY mécanique 87 touches

3. **Souris Gaming** - 49.00€
   - Souris optique 16000 DPI

## 🔌 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```

- `POST /api/auth/login` - Connexion
  ```json
  {
    "email": "alice@example.com",
    "password": "Password1!"
  }
  ```

- `POST /api/auth/logout` - Déconnexion (mock)

- `POST /api/auth/reset-password` - Réinitialisation (mock)

### Produits

- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit

### Panier (nécessite authentification)

- `GET /api/cart` - Récupérer le panier
- `POST /api/cart/add` - Ajouter un produit
  ```json
  {
    "productId": 1,
    "qty": 2
  }
  ```
- `PUT /api/cart/update` - Modifier la quantité
  ```json
  {
    "productId": 1,
    "qty": 3
  }
  ```
- `DELETE /api/cart/remove/:productId` - Supprimer un produit

### Commandes (nécessite authentification)

- `POST /api/orders` - Créer une commande depuis le panier
- `GET /api/orders` - Liste des commandes de l'utilisateur
- `GET /api/orders/:id` - Détails d'une commande

### Health Check

- `GET /api/health` - Vérifier l'état du serveur

## 📁 Structure du projet

```
EasyShop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Configuration SQLite
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   └── orderController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   └── orders.js
│   │   └── middleware/
│   │       └── auth.js            # Middleware JWT
│   ├── data/
│   │   └── easyshop.db            # Base de données SQLite (générée)
│   ├── server.js                  # Point d'entrée
│   ├── init_db.js                 # Script d'initialisation
│   ├── package.json
│   └── env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Button.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cart.jsx
│   │   │   └── Checkout.jsx
│   │   ├── services/
│   │   │   └── api.js             # Configuration Axios
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│   ├── Plan_de_Test_from_template.md
│   ├── matrice_bidirectionnelle.csv
│   └── report_cloture.md
│
├── smoke_test.js                  # Script de smoke test
└── README.md
```

## 🧪 Tests

### Smoke Test

Un script de smoke test est fourni pour vérifier rapidement les fonctionnalités critiques :

```bash
# S'assurer que le backend est démarré
cd backend
npm run dev

# Dans un autre terminal, exécuter le smoke test
node smoke_test.js
```

Le script vérifie :
- ✅ Health check du serveur
- ✅ Liste des produits
- ✅ Détails d'un produit
- ✅ Connexion utilisateur
- ✅ Ajout au panier
- ✅ Consultation du panier
- ✅ Création de commande
- ✅ Protection des routes (401 sans token)

### Tests manuels

Consultez le document `docs/Plan_de_Test_from_template.md` pour la liste complète des cas de test.

## 📚 Documentation

- **Plan de Test** : `docs/Plan_de_Test_from_template.md`
- **Matrice bidirectionnelle** : `docs/matrice_bidirectionnelle.csv`
- **Rapport de clôture** : `docs/report_cloture.md`

## 🔧 Configuration

### Variables d'environnement (Backend)

Créer un fichier `.env` dans le dossier `backend/` :

```env
JWT_SECRET=changeme_super_secret_key_for_jwt_tokens
PORT=4000
DB_FILE=./data/easyshop.db
```

### Réinitialiser la base de données

Pour réinitialiser la base de données avec les données de test :

```bash
cd backend
node init_db.js
```

⚠️ **Attention** : Cela supprimera toutes les données existantes.

## 🐛 Dépannage

### Le backend ne démarre pas

- Vérifier que le port 4000 n'est pas déjà utilisé
- Vérifier que Node.js 18+ est installé
- Vérifier que les dépendances sont installées (`npm install`)

### Le frontend ne se connecte pas au backend

- Vérifier que le backend est démarré sur le port 4000
- Vérifier la configuration CORS dans `backend/server.js`
- Vérifier la configuration du proxy dans `frontend/vite.config.js`

### Erreur de base de données

- Supprimer le fichier `backend/data/easyshop.db`
- Réexécuter `node init_db.js`

## 📝 Notes

- Ceci est un **prototype** et ne doit pas être utilisé en production sans modifications importantes
- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les tokens JWT expirent après 7 jours
- Aucun système de paiement réel n'est implémenté

## 📄 Licence

Ce projet est un prototype éducatif.

---

**Développé avec ❤️ pour EasyShop**

