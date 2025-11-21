# 🚀 Guide de démarrage rapide - EasyShop

## Installation rapide

### 1. Backend (Terminal 1)

```bash
cd backend
npm install
cp env.example .env  # ou Copy-Item env.example .env sur Windows PowerShell
node init_db.js
npm run dev
```

✅ Backend démarré sur http://localhost:4000

### 2. Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend démarré sur http://localhost:5173

### 3. Ouvrir le navigateur

👉 http://localhost:5173

## Comptes de test

| Email | Mot de passe |
|-------|--------------|
| alice@example.com | Password1! |
| bob@example.com | Password2! |
| charlie@example.com | Password3! |

## Smoke Test

```bash
# Dans un terminal (backend doit être démarré)
node smoke_test.js
```

## Réinitialiser la base de données

```bash
cd backend
node init_db.js
```

⚠️ Cela supprimera toutes les données existantes.

## Commandes utiles

### Backend
- `npm start` - Démarrer en mode production
- `npm run dev` - Démarrer en mode développement (nodemon)
- `npm run init-db` - Initialiser la base de données

### Frontend
- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualiser le build de production

## Dépannage

**Port déjà utilisé ?**
- Backend : Modifier `PORT` dans `.env`
- Frontend : Modifier `port` dans `vite.config.js`

**Erreur de base de données ?**
- Supprimer `backend/data/easyshop.db`
- Réexécuter `node init_db.js`

**Erreur de dépendances ?**
- Supprimer `node_modules` et `package-lock.json`
- Réexécuter `npm install`

