/**
 * Modèle Order - Gestion des commandes
 */
import db from '../config/db.js';
import Cart from './Cart.js';

class Order {
  /**
   * Créer une nouvelle commande à partir du panier
   */
  static createFromCart(userId) {
    const cartItems = Cart.findByUserId(userId);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Le panier est vide');
    }

    // Calculer le total
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Créer la commande
    const orderStmt = db.prepare(`
      INSERT INTO orders (user_id, total, status, created_at)
      VALUES (?, ?, 'pending', datetime('now'))
    `);
    const orderResult = orderStmt.run(userId, total);
    const orderId = orderResult.lastInsertRowid;

    // Créer les items de commande
    const itemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    for (const item of cartItems) {
      itemStmt.run(orderId, item.product_id, item.quantity, item.price);
    }

    // Vider le panier
    Cart.clear(userId);

    return this.findById(orderId);
  }

  /**
   * Trouver une commande par ID avec détails
   */
  static findById(orderId) {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) return null;

    const items = db.prepare(`
      SELECT 
        oi.*,
        p.title,
        p.description,
        p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(orderId);

    return {
      ...order,
      items
    };
  }

  /**
   * Obtenir toutes les commandes d'un utilisateur
   */
  static findByUserId(userId) {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);

    // Ajouter les items pour chaque commande
    return orders.map(order => this.findById(order.id));
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  static updateStatus(orderId, status) {
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    stmt.run(status, orderId);
    return this.findById(orderId);
  }
}

export default Order;

