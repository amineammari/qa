/**
 * Tests unitaires pour le modèle User
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import User from '../../../src/models/User.js';
import { createTestDb, cleanupTestDb } from '../../helpers/testDb.js';
import bcrypt from 'bcrypt';

describe('Modèle User', () => {
  let db;
  let originalDb;

  beforeEach(() => {
    // Créer une base de données de test
    db = createTestDb();
    
    // Remplacer temporairement la connexion DB dans le modèle
    // Note: Cela nécessite que le modèle accepte une injection de dépendance
    // Pour l'instant, on va utiliser la vraie DB de test
    process.env.DB_FILE = './data/test.db';
  });

  afterEach(() => {
    cleanupTestDb();
  });

  describe('create', () => {
    it('devrait créer un nouvel utilisateur', () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      };

      const user = User.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBeUndefined(); // Le mot de passe ne doit pas être retourné
    });

    it('devrait hasher le mot de passe', () => {
      const userData = {
        name: 'Test User',
        email: 'test2@example.com',
        password: 'Password123!'
      };

      const user = User.create(userData);
      
      // Vérifier que le mot de passe est hashé dans la DB
      const dbUser = User.findByEmail('test2@example.com');
      expect(dbUser.password).not.toBe('Password123!');
      expect(bcrypt.compareSync('Password123!', dbUser.password)).toBe(true);
    });

    it('devrait rejeter un email déjà utilisé', () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'Password123!'
      };

      User.create(userData);

      expect(() => {
        User.create(userData);
      }).toThrow('Email déjà utilisé');
    });
  });

  describe('findByEmail', () => {
    it('devrait trouver un utilisateur par email', () => {
      const userData = {
        name: 'Test User',
        email: 'find@example.com',
        password: 'Password123!'
      };

      User.create(userData);
      const user = User.findByEmail('find@example.com');

      expect(user).toBeDefined();
      expect(user.email).toBe('find@example.com');
    });

    it('devrait retourner undefined si l\'utilisateur n\'existe pas', () => {
      const user = User.findByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });
  });

  describe('verifyPassword', () => {
    it('devrait vérifier correctement un mot de passe valide', () => {
      const userData = {
        name: 'Test User',
        email: 'verify@example.com',
        password: 'Password123!'
      };

      const user = User.create(userData);
      const dbUser = User.findByEmail('verify@example.com');
      
      const isValid = User.verifyPassword(dbUser, 'Password123!');
      expect(isValid).toBe(true);
    });

    it('devrait rejeter un mot de passe invalide', () => {
      const userData = {
        name: 'Test User',
        email: 'verify2@example.com',
        password: 'Password123!'
      };

      const user = User.create(userData);
      const dbUser = User.findByEmail('verify2@example.com');
      
      const isValid = User.verifyPassword(dbUser, 'WrongPassword');
      expect(isValid).toBe(false);
    });
  });
});

