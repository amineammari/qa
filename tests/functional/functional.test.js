/**
 * Tests fonctionnels améliorés
 * Tests basés sur les exigences métier
 */
import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:4000/api';

describe('Tests Fonctionnels - Exigences Métier', () => {
  let authToken;

  beforeAll(async () => {
    // Se connecter pour obtenir un token
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'Password1!'
      })
    });
    const data = await response.json();
    authToken = data.token;
  });

  describe('EXG-01: Inscription utilisateur', () => {
    it('TC-001: POST /api/register avec données valides', async () => {
      const email = `test-${Date.now()}@example.com`;
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: email,
          password: 'Password123!'
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.message).toBe('Utilisateur créé avec succès');
      expect(data.token).toBeDefined();
      expect(data.user.email).toBe(email);
    });

    it('TC-002: POST /api/register avec email déjà utilisé', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'alice@example.com',
          password: 'Password123!'
        })
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe('Email déjà utilisé');
    });

    it('TC-003: POST /api/register avec champs manquants', async () => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User'
          // email et password manquants
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });

  describe('EXG-02: Connexion utilisateur', () => {
    it('TC-004: POST /api/login avec credentials valides', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'alice@example.com',
          password: 'Password1!'
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.token).toBeDefined();
      expect(data.user).toBeDefined();
    });

    it('TC-005: POST /api/login avec email invalide', async () => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'Password1!'
        })
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Email ou mot de passe incorrect');
    });

    it('TC-006: POST /api/login avec mot de passe incorrect', async () => {
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
      expect(data.error).toBe('Email ou mot de passe incorrect');
    });
  });

  describe('EXG-05: Liste des produits', () => {
    it('TC-009: GET /api/products retourne liste complète', async () => {
      const response = await fetch(`${BASE_URL}/products`);
      expect(response.status).toBe(200);
      const products = await response.json();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('EXG-06: Détails produit', () => {
    it('TC-011: GET /api/products/:id avec ID valide', async () => {
      const response = await fetch(`${BASE_URL}/products/1`);
      expect(response.status).toBe(200);
      const product = await response.json();
      expect(product.id).toBe(1);
      expect(product.title).toBeDefined();
      expect(product.price).toBeDefined();
    });

    it('TC-012: GET /api/products/:id avec ID inexistant (404)', async () => {
      const response = await fetch(`${BASE_URL}/products/999`);
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Produit non trouvé');
    });
  });

  describe('EXG-07: Ajouter au panier', () => {
    it('TC-013: POST /api/cart/add avec token valide', async () => {
      // Obtenir un produit
      const productsResponse = await fetch(`${BASE_URL}/products`);
      const products = await productsResponse.json();
      const productId = products[0].id;

      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          productId: productId,
          qty: 1
        })
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.message).toBe('Produit ajouté au panier');
    });

    it('TC-014: POST /api/cart/add sans token (401)', async () => {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 1,
          qty: 1
        })
      });

      expect(response.status).toBe(401);
    });

    it('TC-015: POST /api/cart/add avec productId inexistant', async () => {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          productId: 999,
          qty: 1
        })
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Produit non trouvé');
    });
  });

  describe('EXG-08: Consulter panier', () => {
    it('TC-016: GET /api/cart avec token valide', async () => {
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

    it('TC-017: GET /api/cart sans token (401)', async () => {
      const response = await fetch(`${BASE_URL}/cart`);
      expect(response.status).toBe(401);
    });
  });

  describe('EXG-11: Créer commande', () => {
    it('TC-021: POST /api/orders avec panier non vide', async () => {
      // S'assurer qu'il y a des items dans le panier
      const productsResponse = await fetch(`${BASE_URL}/products`);
      const products = await productsResponse.json();
      
      // Ajouter un produit au panier
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

    it('TC-023: POST /api/orders sans token (401)', async () => {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST'
      });

      expect(response.status).toBe(401);
    });
  });
});

