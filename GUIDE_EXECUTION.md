# 🚀 Guide d'exécution et de test - EasyShop

## 📋 Prérequis

- **Node.js** version 18 ou supérieure
- **npm** (installé avec Node.js)
- Un navigateur web moderne

## 🔧 Installation et configuration

### 1. Configuration du Backend

Ouvrez un terminal PowerShell et exécutez :

```powershell
# Aller dans le dossier backend
cd backend

# Installer les dépendances (si pas déjà fait)
npm install

# Créer le fichier .env (si pas déjà fait)
Copy-Item env.example .env

# Initialiser la base de données avec les données de test
node init_db.js
```

✅ Le fichier `.env` est maintenant créé et la base de données est initialisée avec :
- 3 utilisateurs de test
- 3 produits de test

### 2. Configuration du Frontend

Ouvrez un **nouveau terminal PowerShell** et exécutez :

```powershell
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances (si pas déjà fait)
npm install
```

## ▶️ Exécution du projet

### Démarrer le Backend

Dans le premier terminal (dans le dossier `backend`) :

```powershell
npm run dev
```

✅ Le backend démarre sur **http://localhost:4000**

Vous devriez voir :
```
Serveur démarré sur le port 4000
Base de données connectée
```

### Démarrer le Frontend

Dans le deuxième terminal (dans le dossier `frontend`) :

```powershell
npm run dev
```

✅ Le frontend démarre sur **http://localhost:5173**

Vous devriez voir :
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Accéder à l'application

1. Ouvrez votre navigateur
2. Allez sur **http://localhost:5173**
3. Vous verrez la page d'accueil d'EasyShop

## 🧪 Tests

### Test 1 : Smoke Test Automatique

Le smoke test vérifie automatiquement toutes les fonctionnalités critiques de l'API.

**Prérequis** : Le backend doit être démarré

Ouvrez un **nouveau terminal** (à la racine du projet) :

```powershell
# Depuis la racine du projet
node smoke_test.js
```

Le script teste :
- ✅ Health check du serveur
- ✅ Liste des produits
- ✅ Détails d'un produit
- ✅ Connexion utilisateur
- ✅ Ajout au panier
- ✅ Consultation du panier
- ✅ Création de commande
- ✅ Protection des routes (401 sans token)

**Résultat attendu** : Tous les tests doivent passer (8/8)

### Test 2 : Tests Manuels via l'Interface

#### Test de connexion

1. Cliquez sur **"Se connecter"** dans la navbar
2. Utilisez un des comptes de test :

| Email | Mot de passe |
|-------|--------------|
| alice@example.com | Password1! |
| bob@example.com | Password2! |
| charlie@example.com | Password3! |

3. Vérifiez que vous êtes redirigé vers la page d'accueil
4. Vérifiez que votre nom apparaît dans la navbar

#### Test du catalogue

1. Sur la page d'accueil, vous devriez voir 3 produits :
   - Casque Audio (129.00€)
   - Clavier Mécanique (89.00€)
   - Souris Gaming (49.00€)

2. Cliquez sur un produit pour voir ses détails

#### Test du panier

1. Cliquez sur **"Ajouter au panier"** sur un produit
2. Cliquez sur l'icône panier dans la navbar
3. Vérifiez que le produit apparaît dans le panier
4. Modifiez la quantité
5. Supprimez un produit du panier

#### Test de commande

1. Ajoutez des produits au panier
2. Allez dans le panier
3. Cliquez sur **"Passer la commande"**
4. Vérifiez que la commande est créée
5. Vérifiez que le panier est vidé

### Test 3 : Tests API avec un outil externe

Vous pouvez tester l'API directement avec **Postman**, **Thunder Client** (VS Code), ou **curl**.

#### Exemple avec curl (PowerShell)

```powershell
# Health check
curl http://localhost:4000/api/health

# Liste des produits
curl http://localhost:4000/api/products

# Connexion
$body = @{
    email = "alice@example.com"
    password = "Password1!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.token

# Ajouter au panier (avec token)
$cartBody = @{
    productId = 1
    qty = 2
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:4000/api/cart/add" -Method Post -Body $cartBody -ContentType "application/json" -Headers $headers
```

## 📊 Comptes de test

| Email | Mot de passe | Nom |
|-------|--------------|-----|
| alice@example.com | Password1! | Alice Dupont |
| bob@example.com | Password2! | Bob Martin |
| charlie@example.com | Password3! | Charlie Roy |

## 🔄 Réinitialiser la base de données

Si vous voulez réinitialiser la base de données avec les données de test :

```powershell
cd backend
node init_db.js
```

⚠️ **Attention** : Cela supprimera toutes les données existantes (utilisateurs, produits, commandes, etc.)

## 🐛 Dépannage

### Le backend ne démarre pas

- Vérifiez que le port 4000 n'est pas déjà utilisé
- Vérifiez que Node.js 18+ est installé : `node --version`
- Vérifiez que les dépendances sont installées : `npm install` dans `backend/`
- Vérifiez que le fichier `.env` existe dans `backend/`

### Le frontend ne se connecte pas au backend

- Vérifiez que le backend est démarré sur le port 4000
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que l'URL de l'API est correcte dans `frontend/src/services/api.js`

### Erreur de base de données

- Supprimez le fichier `backend/data/easyshop.db`
- Réexécutez `node init_db.js` dans `backend/`

### Le smoke test échoue

- Vérifiez que le backend est démarré
- Vérifiez que la base de données est initialisée (`node init_db.js`)
- Vérifiez que vous êtes à la racine du projet quand vous exécutez `node smoke_test.js`

## 📝 Commandes utiles

### Backend

```powershell
cd backend
npm start          # Démarrer en mode production
npm run dev        # Démarrer en mode développement (avec nodemon)
npm run init-db    # Initialiser la base de données
```

### Frontend

```powershell
cd frontend
npm run dev        # Démarrer le serveur de développement
npm run build      # Build de production
npm run preview    # Prévisualiser le build de production
```

## ✅ Checklist de vérification

Avant de tester, assurez-vous que :

- [ ] Node.js 18+ est installé
- [ ] Les dépendances backend sont installées (`npm install` dans `backend/`)
- [ ] Les dépendances frontend sont installées (`npm install` dans `frontend/`)
- [ ] Le fichier `.env` existe dans `backend/`
- [ ] La base de données est initialisée (`node init_db.js`)
- [ ] Le backend est démarré sur le port 4000
- [ ] Le frontend est démarré sur le port 5173

## 🎯 Prochaines étapes

Une fois le projet démarré :

1. ✅ Exécutez le smoke test pour vérifier que tout fonctionne
2. ✅ Testez manuellement via l'interface web
3. ✅ Consultez `docs/Plan_de_Test_from_template.md` pour les cas de test détaillés
4. ✅ Consultez `docs/report_cloture.md` pour les rapports de test

---

**Besoin d'aide ?** Consultez le `README.md` pour plus de détails sur l'architecture et les endpoints API.

