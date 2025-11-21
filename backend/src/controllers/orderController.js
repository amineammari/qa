/**
 * Contrôleur des commandes
 * Gère la création et la récupération des commandes
 */
import Order from '../models/Order.js';

/**
 * Créer une commande à partir du panier
 * POST /api/order
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Créer la commande (vide le panier automatiquement)
    const order = Order.createFromCart(userId);

    res.status(201).json({
      message: 'Commande créée avec succès',
      order
    });
  } catch (error) {
    if (error.message === 'Le panier est vide') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la commande' });
  }
};

/**
 * Obtenir toutes les commandes de l'utilisateur connecté
 * GET /api/orders
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = Order.findByUserId(userId);

    res.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Obtenir une commande par ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = Order.findById(parseInt(id));

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Vérifier que la commande appartient à l'utilisateur
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

