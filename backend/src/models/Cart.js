/**
 * Modèle Cart - Gestion du panier utilisateur
 */
import db from '../config/db.js';

class Cart {
  /**
   * Obtenir le panier complet d'un utilisateur avec détails produits
   */
  static findByUserId(userId) {
    const stmt = db.prepare(`
      SELECT 
        c.id,
        c.product_id,
        c.quantity,
        c.created_at,
        p.title,
        p.price,
        p.description,
        p.image_url,
        (c.quantity * p.price) as subtotal
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `);
    return stmt.all(userId);
  }

  /**
   * Ajouter un produit au panier ou mettre à jour la quantité
   */
  static addItem(userId, productId, quantity = 1) {
    // Vérifier si l'item existe déjà
    const existing = db.prepare('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?')
      .get(userId, productId);

    if (existing) {
      // Mettre à jour la quantité
      const newQuantity = existing.quantity + quantity;
      const stmt = db.prepare('UPDATE cart SET quantity = ? WHERE id = ?');
      stmt.run(newQuantity, existing.id);
    } else {
      // Créer un nouvel item
      const stmt = db.prepare(`
        INSERT INTO cart (user_id, product_id, quantity, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `);
      stmt.run(userId, productId, quantity);
    }

    return this.findByUserId(userId);
  }

  /**
   * Mettre à jour la quantité d'un item
   */
  static updateQuantity(userId, productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const stmt = db.prepare(`
      UPDATE cart 
      SET quantity = ? 
      WHERE user_id = ? AND product_id = ?
    `);
    stmt.run(quantity, userId, productId);
    
    return this.findByUserId(userId);
  }

  /**
   * Supprimer un item du panier
   */
  static removeItem(userId, productId) {
    const stmt = db.prepare('DELETE FROM cart WHERE user_id = ? AND product_id = ?');
    stmt.run(userId, productId);
    return this.findByUserId(userId);
  }

  /**
   * Vider le panier d'un utilisateur
   */
  static clear(userId) {
    const stmt = db.prepare('DELETE FROM cart WHERE user_id = ?');
    stmt.run(userId);
  }

  /**
   * Calculer le total du panier
   */
  static getTotal(userId) {
    const items = this.findByUserId(userId);
    return items.reduce((total, item) => total + item.subtotal, 0);
  }
}

export default Cart;

