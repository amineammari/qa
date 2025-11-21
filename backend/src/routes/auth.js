/**
 * Routes d'authentification
 */
import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

// Déconnexion (mock)
router.post('/logout', authController.logout);

// Réinitialisation de mot de passe (mock)
router.post('/reset-password', authController.resetPassword);

export default router;

