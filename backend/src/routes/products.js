/**
 * Routes des produits
 */
import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// Obtenir tous les produits (public)
router.get('/', productController.getAllProducts);

// Obtenir un produit par ID (public)
router.get('/:id', productController.getProductById);

export default router;

