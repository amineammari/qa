/**
 * Tests unitaires pour le middleware d'authentification
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate, optionalAuth } from '../../../src/middleware/auth.js';

describe('Middleware d\'authentification', () => {
  const secret = 'test_secret_key';
  process.env.JWT_SECRET = secret;

  describe('authenticate', () => {
    it('devrait accepter un token valide', () => {
      const token = jwt.sign({ userId: 1, email: 'test@example.com' }, secret);
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      const res = {};
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      authenticate(req, res, next);

      expect(nextCalled).toBe(true);
      expect(req.user).toEqual({
        id: 1,
        email: 'test@example.com'
      });
    });

    it('devrait rejeter une requête sans token', () => {
      const req = {
        headers: {}
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token manquant. Veuillez vous connecter.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter un token invalide', () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid_token'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token invalide'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('devrait rejeter un token expiré', () => {
      const token = jwt.sign(
        { userId: 1, email: 'test@example.com' },
        secret,
        { expiresIn: '-1h' }
      );
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Token expiré'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('devrait ajouter user si token valide', () => {
      const token = jwt.sign({ userId: 1, email: 'test@example.com' }, secret);
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      const res = {};
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      optionalAuth(req, res, next);

      expect(nextCalled).toBe(true);
      expect(req.user).toEqual({
        id: 1,
        email: 'test@example.com'
      });
    });

    it('devrait continuer sans user si pas de token', () => {
      const req = {
        headers: {}
      };
      const res = {};
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      optionalAuth(req, res, next);

      expect(nextCalled).toBe(true);
      expect(req.user).toBeUndefined();
    });
  });
});

