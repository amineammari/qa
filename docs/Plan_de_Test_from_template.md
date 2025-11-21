# Plan de Test - EasyShop E-commerce Prototype

**Version:** 1.0.0  
**Date:** 2024  
**Auteur:** Équipe QA EasyShop  
**Statut:** Draft

---

## 1. Introduction

### 1.1 Objectif du document

Ce document présente le plan de test pour l'application prototype EasyShop, une plateforme e-commerce minimale développée avec Express.js (backend) et React/Vite (frontend). Il définit la stratégie de test, les éléments à tester, les critères d'acceptation et les métriques de qualité.

### 1.2 Portée

Ce plan couvre les tests fonctionnels de l'application EasyShop, incluant :
- Authentification utilisateur (inscription, connexion, déconnexion)
- Gestion des produits (affichage, détails)
- Gestion du panier (ajout, modification, suppression)
- Création de commandes
- Interface utilisateur et expérience utilisateur

### 1.3 Références

- Spécifications fonctionnelles EasyShop
- Architecture technique : Express.js + SQLite (backend), React + Vite (frontend)
- API REST endpoints documentés

---

## 2. Caractéristiques à tester

### 2.1 Authentification (EXG-01 à EXG-04)

**EXG-01 - Inscription utilisateur**
- Description : Un nouvel utilisateur peut créer un compte
- Priorité : Haute
- Critères d'acceptation :
  - Formulaire d'inscription fonctionnel
  - Validation des champs (nom, email, mot de passe)
  - Hash du mot de passe avec bcrypt
  - Génération d'un token JWT
  - Gestion des erreurs (email déjà utilisé)

**EXG-02 - Connexion utilisateur**
- Description : Un utilisateur peut se connecter avec email/mot de passe
- Priorité : Haute
- Critères d'acceptation :
  - Authentification réussie avec credentials valides
  - Génération et stockage du token JWT
  - Rejet des credentials invalides
  - Redirection appropriée après connexion

**EXG-03 - Déconnexion**
- Description : Un utilisateur connecté peut se déconnecter
- Priorité : Moyenne
- Critères d'acceptation :
  - Suppression du token côté client
  - Redirection vers la page d'accueil

**EXG-04 - Réinitialisation de mot de passe**
- Description : Fonctionnalité mock pour réinitialisation
- Priorité : Basse
- Critères d'acceptation :
  - Accepte un email et retourne un message de confirmation

### 2.2 Gestion des produits (EXG-05 à EXG-06)

**EXG-05 - Liste des produits**
- Description : Affichage de tous les produits disponibles
- Priorité : Haute
- Critères d'acceptation :
  - Endpoint GET /api/products retourne la liste
  - Affichage correct dans l'interface
  - Gestion du cas "aucun produit"

**EXG-06 - Détails d'un produit**
- Description : Affichage des détails d'un produit spécifique
- Priorité : Haute
- Critères d'acceptation :
  - Endpoint GET /api/products/:id fonctionnel
  - Affichage des informations complètes
  - Gestion du produit inexistant (404)

### 2.3 Gestion du panier (EXG-07 à EXG-10)

**EXG-07 - Ajouter au panier**
- Description : Ajouter un produit au panier utilisateur
- Priorité : Haute
- Critères d'acceptation :
  - Endpoint POST /api/cart/add fonctionnel
  - Authentification requise (JWT)
  - Mise à jour de la quantité si produit déjà présent
  - Validation de la quantité

**EXG-08 - Consulter le panier**
- Description : Afficher le contenu du panier de l'utilisateur
- Priorité : Haute
- Critères d'acceptation :
  - Endpoint GET /api/cart retourne les items
  - Calcul correct du total
  - Affichage des détails produits

**EXG-09 - Modifier la quantité**
- Description : Modifier la quantité d'un produit dans le panier
- Priorité : Moyenne
- Critères d'acceptation :
  - Endpoint PUT /api/cart/update fonctionnel
  - Validation de la quantité (>= 0)
  - Suppression automatique si quantité = 0

**EXG-10 - Supprimer du panier**
- Description : Retirer un produit du panier
- Priorité : Moyenne
- Critères d'acceptation :
  - Endpoint DELETE /api/cart/remove/:productId fonctionnel
  - Mise à jour immédiate du panier

### 2.4 Commandes (EXG-11)

**EXG-11 - Créer une commande**
- Description : Convertir le panier en commande
- Priorité : Haute
- Critères d'acceptation :
  - Endpoint POST /api/orders fonctionnel
  - Création de la commande avec items
  - Calcul correct du total
  - Vidage automatique du panier
  - Gestion du panier vide

---

## 3. Éléments non testés

- Tests de performance et charge
- Tests de sécurité approfondis (injection SQL, XSS)
- Tests d'intégration avec systèmes de paiement
- Tests de compatibilité navigateurs multiples
- Tests d'accessibilité (WCAG)

---

## 4. Approche de test

### 4.1 Types de tests

- **Tests fonctionnels** : Vérification des fonctionnalités métier
- **Tests d'intégration** : Vérification des interactions API
- **Tests de régression** : Vérification après modifications
- **Tests de smoke** : Vérification des fonctionnalités critiques

### 4.2 Techniques de test

- Tests manuels exploratoires
- Tests automatisés via scripts (smoke_test.js)
- Tests d'API avec curl/Postman
- Tests d'interface utilisateur

---

## 5. Critères de réussite et critères d'arrêt

### 5.1 Critères de réussite

- Tous les cas de test critiques (Priorité Haute) passent
- Taux de réussite ≥ 80% pour tous les cas de test
- Aucun défaut critique non résolu
- Documentation à jour

### 5.2 Critères d'arrêt

Les tests s'arrêtent si :
- Plus de 3 défauts critiques bloquants
- Infrastructure de test non disponible
- Données de test corrompues

### 5.3 Critères de reprise

Les tests reprennent après :
- Correction des défauts bloquants
- Restauration de l'infrastructure
- Réinitialisation des données de test

---

## 6. Environnements de test

### 6.1 Environnement de développement

- **Backend** : http://localhost:4000
- **Frontend** : http://localhost:5173
- **Base de données** : SQLite (easyshop.db)
- **Node.js** : v18+

### 6.2 Données de test

**Utilisateurs de test :**
- alice@example.com / Password1!
- bob@example.com / Password2!
- charlie@example.com / Password3!

**Produits de test :**
- Casque Audio - 129.00€
- Clavier Mécanique - 89.00€
- Souris Gaming - 49.00€

---

## 7. Responsabilités

- **Développeur** : Implémentation et corrections
- **Testeur** : Exécution des tests et reporting
- **Chef de projet** : Validation et approbation

---

## 8. Planning et ressources

### 8.1 Estimation

- **Tests fonctionnels** : 2 jours
- **Tests d'intégration** : 1 jour
- **Tests de régression** : 1 jour
- **Total** : 4 jours

### 8.2 Ressources nécessaires

- Environnement de développement configuré
- Accès à la base de données
- Comptes de test
- Outils de test (Postman, navigateur)

---

## 9. Risques et contraintes

### 9.1 Risques

- **Risque 1** : Base de données corrompue
  - **Mitigation** : Script init_db.js pour réinitialisation

- **Risque 2** : Token JWT expiré pendant les tests
  - **Mitigation** : Durée de vie de 7 jours, reconnexion si nécessaire

### 9.2 Contraintes

- Prototype minimal, fonctionnalités limitées
- Pas de système de paiement réel
- Données de test statiques

---

## 10. Métriques et reporting

### 10.1 Métriques à suivre

- Nombre de cas de test planifiés
- Nombre de cas de test exécutés
- Taux de réussite (%)
- Nombre de défauts détectés (par sévérité)
- Temps d'exécution des tests

### 10.2 Reporting

- Rapport de clôture de test (voir `report_cloture.md`)
- Matrice bidirectionnelle (exigences ↔ cas de test)
- Logs d'exécution des tests automatisés

---

## 11. Glossaire

- **JWT** : JSON Web Token, mécanisme d'authentification
- **API REST** : Architecture d'API utilisant les méthodes HTTP
- **SQLite** : Base de données relationnelle légère
- **Smoke Test** : Test rapide des fonctionnalités critiques

---

## 12. Approbations

| Rôle | Nom | Date | Signature |
|------|-----|------|-----------|
| Chef de projet | | | |
| Testeur | | | |
| Développeur | | | |

---

**Document généré automatiquement pour EasyShop Prototype**

