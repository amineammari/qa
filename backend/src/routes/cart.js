/**
 * Routes du panier
 * Toutes les routes nécessitent une authentification
 */
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Obtenir le panier
router.get('/', cartController.getCart);

// Ajouter un produit au panier
router.post('/add', cartController.addToCart);

// Mettre à jour la quantité
router.put('/update', cartController.updateCartItem);

// Supprimer un produit du panier
router.delete('/remove/:productId', cartController.removeFromCart);

export default router;

