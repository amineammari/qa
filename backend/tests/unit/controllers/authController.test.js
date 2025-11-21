/**
 * Tests unitaires pour le contrôleur d'authentification
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { register, login, logout, resetPassword } from '../../../src/controllers/authController.js';
import * as UserModule from '../../../src/models/User.js';

// Mock du modèle User
vi.mock('../../../src/models/User.js', () => ({
  default: {
    create: vi.fn(),
    findByEmail: vi.fn(),
    verifyPassword: vi.fn()
  }
}));

describe('AuthController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('devrait créer un utilisateur avec des données valides', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      };

      UserModule.default.create.mockReturnValue(mockUser);

      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await register(req, res);

      expect(UserModule.default.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Utilisateur créé avec succès',
          token: expect.any(String),
          user: expect.objectContaining({
            id: 1,
            name: 'Test User',
            email: 'test@example.com'
          })
        })
      );
    });

    it('devrait rejeter une inscription avec des champs manquants', async () => {
      const req = {
        body: {
          name: 'Test User'
          // email et password manquants
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Tous les champs sont requis (name, email, password)'
      });
      expect(UserModule.default.create).not.toHaveBeenCalled();
    });

    it('devrait rejeter un email invalide', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'invalid-email',
          password: 'Password123!'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Format d\'email invalide'
      });
    });

    it('devrait rejeter un mot de passe trop court', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: '12345' // moins de 6 caractères
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    });

    it('devrait gérer un email déjà utilisé', async () => {
      UserModule.default.create.mockImplementation(() => {
        throw new Error('Email déjà utilisé');
      });

      const req = {
        body: {
          name: 'Test User',
          email: 'existing@example.com',
          password: 'Password123!'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email déjà utilisé'
      });
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur avec des credentials valides', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      };

      UserModule.default.findByEmail.mockReturnValue(mockUser);
      UserModule.default.verifyPassword.mockReturnValue(true);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      };
      const res = {
        json: jest.fn()
      };

      await login(req, res);

      expect(UserModule.default.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(UserModule.default.verifyPassword).toHaveBeenCalledWith(mockUser, 'Password123!');
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Connexion réussie',
          token: expect.any(String),
          user: expect.objectContaining({
            id: 1,
            name: 'Test User',
            email: 'test@example.com'
          })
        })
      );
    });

    it('devrait rejeter une connexion avec email invalide', async () => {
      User.findByEmail.mockReturnValue(null);

      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'Password123!'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email ou mot de passe incorrect'
      });
    });

    it('devrait rejeter une connexion avec mot de passe incorrect', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password'
      };

      UserModule.default.findByEmail.mockReturnValue(mockUser);
      UserModule.default.verifyPassword.mockReturnValue(false);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'WrongPassword'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email ou mot de passe incorrect'
      });
    });
  });

  describe('logout', () => {
    it('devrait retourner un message de succès', async () => {
      const req = {};
      const res = {
        json: jest.fn()
      };

      await logout(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Déconnexion réussie. Supprimez le token côté client.'
      });
    });
  });

  describe('resetPassword', () => {
    it('devrait retourner un message même si l\'email n\'existe pas', async () => {
      User.findByEmail.mockReturnValue(null);

      const req = {
        body: {
          email: 'nonexistent@example.com'
        }
      };
      const res = {
        json: jest.fn()
      };

      await resetPassword(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
      });
    });
  });
});

