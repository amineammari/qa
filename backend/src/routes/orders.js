/**
 * Routes des commandes
 * Toutes les routes nécessitent une authentification
 */
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Créer une commande
router.post('/', orderController.createOrder);

// Obtenir toutes les commandes de l'utilisateur
router.get('/', orderController.getUserOrders);

// Obtenir une commande par ID
router.get('/:id', orderController.getOrderById);

export default router;

