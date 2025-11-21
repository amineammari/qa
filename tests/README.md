# 📋 Guide des Tests - EasyShop

Ce document explique comment exécuter les différents types de tests du projet EasyShop.

## 📁 Structure des Tests

```
QA/
├── backend/
│   ├── tests/
│   │   ├── unit/              # Tests unitaires backend
│   │   │   ├── middleware/
│   │   │   ├── controllers/
│   │   │   └── models/
│   │   ├── integration/       # Tests d'intégration backend
│   │   └── helpers/           # Helpers pour les tests
│   └── jest.config.js
│
├── frontend/
│   └── src/
│       └── tests/
│           ├── components/    # Tests de composants React
│           └── setup.js
│
└── tests/
    ├── system/                # Tests système (E2E)
    └── functional/            # Tests fonctionnels
```

## 🧪 Types de Tests

### 1. Tests Unitaires (Backend)

**Localisation :** `backend/tests/unit/`

**Description :** Tests isolés des fonctions, contrôleurs, middleware et modèles.

**Exécution :**
```bash
cd backend
npm test
```

**Exécution avec couverture :**
```bash
cd backend
npm run test:coverage
```

**Tests disponibles :**
- `middleware/auth.test.js` - Tests du middleware d'authentification
- `controllers/authController.test.js` - Tests du contrôleur d'authentification
- `models/User.test.js` - Tests du modèle User

### 2. Tests de Composants (Frontend)

**Localisation :** `frontend/src/tests/components/`

**Description :** Tests des composants React isolés.

**Exécution :**
```bash
cd frontend
npm test
```

**Exécution avec interface graphique :**
```bash
cd frontend
npm run test:ui
```

**Exécution avec couverture :**
```bash
cd frontend
npm run test:coverage
```

**Tests disponibles :**
- `Button.test.jsx` - Tests du composant Button
- `Input.test.jsx` - Tests du composant Input
- `ProductCard.test.jsx` - Tests du composant ProductCard

### 3. Tests d'Intégration (Backend)

**Localisation :** `backend/tests/integration/`

**Description :** Tests des interactions entre les composants (API, base de données).

**Exécution :**
```bash
cd backend
npm test -- tests/integration
```

**Tests disponibles :**
- `api.test.js` - Tests d'intégration de l'API complète

### 4. Tests Fonctionnels

**Localisation :** `tests/functional/`

**Description :** Tests basés sur les exigences métier (matrice bidirectionnelle).

**Prérequis :** Le backend doit être démarré (`npm run dev` dans `backend/`)

**Exécution :**
```bash
# Depuis la racine du projet
npm test -- tests/functional
```

**Tests disponibles :**
- `functional.test.js` - Tests fonctionnels basés sur les exigences EXG-01 à EXG-11

### 5. Tests Système (E2E)

**Localisation :** `tests/system/`

**Description :** Tests end-to-end vérifiant les flux complets utilisateur.

**Prérequis :** 
- Le backend doit être démarré (`npm run dev` dans `backend/`)
- Le frontend doit être démarré (`npm run dev` dans `frontend/`)

**Exécution :**
```bash
# Depuis la racine du projet
npm test -- tests/system
```

**Tests disponibles :**
- `e2e.test.js` - Tests E2E des flux utilisateur complets

### 6. Smoke Tests

**Localisation :** `smoke_test.js` (racine)

**Description :** Tests rapides des fonctionnalités critiques.

**Exécution :**
```bash
# Depuis la racine du projet
node smoke_test.js
```

## 🚀 Exécution Complète

### Exécuter tous les tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# Tests système et fonctionnels (depuis la racine)
npm test -- tests/
```

### Exécuter avec couverture

```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test:coverage
```

## 📊 Couverture de Code

### Backend
- Ouvrir `backend/coverage/index.html` dans un navigateur

### Frontend
- Ouvrir `frontend/coverage/index.html` dans un navigateur

## ⚙️ Configuration

### Backend (Jest)
- Configuration : `backend/jest.config.js`
- Setup : `backend/tests/setup.js`

### Frontend (Vitest)
- Configuration : `frontend/vitest.config.js`
- Setup : `frontend/src/tests/setup.js`

## 🔧 Dépannage

### Les tests backend échouent
- Vérifier que Node.js 18+ est installé
- Vérifier que les dépendances sont installées : `npm install` dans `backend/`
- Vérifier que la base de données de test peut être créée

### Les tests frontend échouent
- Vérifier que les dépendances sont installées : `npm install` dans `frontend/`
- Vérifier que Vitest est correctement configuré

### Les tests système/fonctionnels échouent
- Vérifier que le backend est démarré sur `http://localhost:4000`
- Vérifier que la base de données est initialisée : `node init_db.js` dans `backend/`

## 📝 Ajouter de Nouveaux Tests

### Test unitaire backend
Créer un fichier dans `backend/tests/unit/[module]/[nom].test.js`

### Test de composant frontend
Créer un fichier dans `frontend/src/tests/components/[nom].test.jsx`

### Test fonctionnel
Ajouter dans `tests/functional/functional.test.js` ou créer un nouveau fichier

### Test système
Ajouter dans `tests/system/e2e.test.js` ou créer un nouveau fichier

## 📈 Métriques

Les tests couvrent :
- ✅ Tests unitaires : Middleware, Contrôleurs, Modèles
- ✅ Tests de composants : Button, Input, ProductCard
- ✅ Tests d'intégration : API complète
- ✅ Tests fonctionnels : Toutes les exigences métier
- ✅ Tests système : Flux utilisateur complets
- ✅ Smoke tests : Fonctionnalités critiques

