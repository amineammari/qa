/**
 * Contrôleur du panier
 * Gère les opérations sur le panier utilisateur
 */
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Obtenir le panier de l'utilisateur connecté
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = Cart.findByUserId(userId);
    const total = Cart.getTotal(userId);

    res.json({
      items: cartItems,
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Ajouter un produit au panier
 * POST /api/cart/add
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId requis' });
    }

    const quantity = parseInt(qty) || 1;
    if (quantity <= 0) {
      return res.status(400).json({ error: 'La quantité doit être supérieure à 0' });
    }

    // Vérifier que le produit existe
    const product = Product.findById(parseInt(productId));
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Ajouter au panier
    const cartItems = Cart.addItem(userId, parseInt(productId), quantity);
    const total = Cart.getTotal(userId);

    res.status(201).json({
      message: 'Produit ajouté au panier',
      items: cartItems,
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Supprimer un produit du panier
 * DELETE /api/cart/remove/:productId
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'productId requis' });
    }

    Cart.removeItem(userId, parseInt(productId));
    const cartItems = Cart.findByUserId(userId);
    const total = Cart.getTotal(userId);

    res.json({
      message: 'Produit retiré du panier',
      items: cartItems,
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Mettre à jour la quantité d'un produit dans le panier
 * PUT /api/cart/update
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    if (!productId || qty === undefined) {
      return res.status(400).json({ error: 'productId et qty requis' });
    }

    const quantity = parseInt(qty);
    if (quantity < 0) {
      return res.status(400).json({ error: 'La quantité ne peut pas être négative' });
    }

    const cartItems = Cart.updateQuantity(userId, parseInt(productId), quantity);
    const total = Cart.getTotal(userId);

    res.json({
      message: 'Panier mis à jour',
      items: cartItems,
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du panier:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

