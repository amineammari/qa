/**
 * Contrôleur des produits
 * Gère l'affichage et la gestion des produits
 */
import Product from '../models/Product.js';

/**
 * Obtenir tous les produits
 * GET /api/products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Obtenir un produit par ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = Product.findById(parseInt(id));

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

