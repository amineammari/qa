/**
 * Tests système End-to-End (E2E)
 * Ces tests vérifient les flux complets utilisateur
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const BASE_URL = 'http://localhost:4000/api';
const FRONTEND_URL = 'http://localhost:5173';

describe('Tests Système E2E - Flux Utilisateur Complet', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Vérifier que les serveurs sont démarrés
    try {
      const healthCheck = await fetch(`${BASE_URL}/health`);
      if (!healthCheck.ok) {
        throw new Error('Backend non disponible');
      }
    } catch (error) {
      throw new Error('Les serveurs doivent être démarrés pour les tests E2E');
    }
  });

  describe('Flux complet : Inscription → Navigation → Achat', () => {
    it('devrait permettre l\'inscription d\'un nouvel utilisateur', async () => {
      const email = `test-${Date.now()}@example.com`;
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'E2E Test User',
          email: email,
          password: 'Password123!'
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.token).toBeDefined();
      expect(data.user.email).toBe(email);
      authToken = data.token;
      userId = data.user.id;
    });

    it('devrait permettre la connexion avec les credentials créés', async () => {
      const email = `test-${Date.now()}@example.com`;
      
      // Créer l'utilisateur
      await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'E2E Test User',
          email: email,
          password: 'Password123!'
        })
      });

      // Se connecter
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: 'Password123!'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.token).toBeDefined();
      authToken = data.token;
    });

    it('devrait permettre de consulter les produits', async () => {
      const response = await fetch(`${BASE_URL}/products`);
      expect(response.status).toBe(200);
      const products = await response.json();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('devrait permettre d\'ajouter un produit au panier', async () => {
      // Obtenir les produits
      const productsResponse = await fetch(`${BASE_URL}/products`);
      const products = await productsResponse.json();
      const firstProduct = products[0];

      // Ajouter au panier
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          productId: firstProduct.id,
          qty: 2
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.message).toBe('Produit ajouté au panier');
      expect(data.items).toBeDefined();
    });

    it('devrait permettre de consulter le panier', async () => {
      const response = await fetch(`${BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.items).toBeDefined();
      expect(data.total).toBeDefined();
      expect(Array.isArray(data.items)).toBe(true);
    });

    it('devrait permettre de créer une commande depuis le panier', async () => {
      // S'assurer qu'il y a des items dans le panier
      const cartResponse = await fetch(`${BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const cart = await cartResponse.json();

      if (cart.items.length === 0) {
        // Ajouter un produit si le panier est vide
        const productsResponse = await fetch(`${BASE_URL}/products`);
        const products = await productsResponse.json();
        await fetch(`${BASE_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            productId: products[0].id,
            qty: 1
          })
        });
      }

      // Créer la commande
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.order).toBeDefined();
      expect(data.order.id).toBeDefined();
      expect(data.order.total).toBeDefined();
    });

    it('devrait permettre de consulter les commandes', async () => {
      const response = await fetch(`${BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      expect(response.status).toBe(200);
      const orders = await response.json();
      expect(Array.isArray(orders)).toBe(true);
    });
  });

  describe('Flux d\'erreur', () => {
    it('devrait gérer une tentative de connexion avec mauvais mot de passe', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alice@example.com',
          password: 'WrongPassword'
        })
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('devrait empêcher l\'accès au panier sans authentification', async () => {
      const response = await fetch(`${BASE_URL}/cart`);
      expect(response.status).toBe(401);
    });

    it('devrait empêcher la création de commande avec panier vide', async () => {
      // Créer un nouvel utilisateur avec panier vide
      const email = `test-empty-${Date.now()}@example.com`;
      const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Empty Cart User',
          email: email,
          password: 'Password123!'
        })
      });
      const registerData = await registerResponse.json();
      const newToken = registerData.token;

      // Essayer de créer une commande avec panier vide
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${newToken}`
        }
      });

      // Le backend devrait retourner une erreur
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});

