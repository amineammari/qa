/**
 * Tests d'intégration pour l'API
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../../src/routes/auth.js';
import productRoutes from '../../src/routes/products.js';
import cartRoutes from '../../src/routes/cart.js';
import orderRoutes from '../../src/routes/orders.js';
import { createTestDb, cleanupTestDb } from '../helpers/testDb.js';
import User from '../../src/models/User.js';
import Product from '../../src/models/Product.js';

dotenv.config();

describe('Tests d\'intégration API', () => {
  let app;
  let authToken;
  let userId;

  beforeAll(() => {
    // Créer la base de données de test
    createTestDb();
    process.env.DB_FILE = './data/test.db';
    process.env.JWT_SECRET = 'test_secret_key';

    // Créer l'application Express
    app = express();
    app.use(cors());
    app.use(express.json());

    // Routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK' });
    });
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);

    // Créer un utilisateur de test
    const testUser = User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });
    userId = testUser.id;

    // Créer des produits de test
    Product.create({
      title: 'Test Product 1',
      price: 10.99,
      description: 'Description test 1'
    });
    Product.create({
      title: 'Test Product 2',
      price: 20.99,
      description: 'Description test 2'
    });
  });

  afterAll(() => {
    cleanupTestDb();
  });

  describe('Health Check', () => {
    it('devrait retourner OK', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
    });
  });

  describe('Authentification', () => {
    it('devrait permettre l\'inscription d\'un nouvel utilisateur', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'Password123!'
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('newuser@example.com');
    });

    it('devrait permettre la connexion', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      authToken = response.body.token;
    });

    it('devrait rejeter une connexion avec mauvais mot de passe', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('Produits', () => {
    it('devrait retourner la liste des produits', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('devrait retourner un produit par ID', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.title).toBeDefined();
    });

    it('devrait retourner 404 pour un produit inexistant', async () => {
      await request(app)
        .get('/api/products/999')
        .expect(404);
    });
  });

  describe('Panier', () => {
    it('devrait exiger une authentification', async () => {
      await request(app)
        .get('/api/cart')
        .expect(401);
    });

    it('devrait permettre d\'ajouter un produit au panier', async () => {
      // Se connecter d'abord
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: 1,
          qty: 2
        })
        .expect(201);

      expect(response.body.message).toBe('Produit ajouté au panier');
      expect(response.body.items).toBeDefined();
    });

    it('devrait retourner le panier de l\'utilisateur', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.items).toBeDefined();
      expect(response.body.total).toBeDefined();
    });
  });
});

