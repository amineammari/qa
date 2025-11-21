/**
 * Modèle Product - Gestion des produits
 */
import db from '../config/db.js';

class Product {
  /**
   * Créer un nouveau produit
   */
  static create(productData) {
    const { title, price, description, image_url = null } = productData;
    
    const stmt = db.prepare(`
      INSERT INTO products (title, price, description, image_url, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    const result = stmt.run(title, price, description, image_url);
    return this.findById(result.lastInsertRowid);
  }

  /**
   * Trouver un produit par ID
   */
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Obtenir tous les produits
   */
  static findAll() {
    const stmt = db.prepare('SELECT * FROM products ORDER BY created_at DESC');
    return stmt.all();
  }

  /**
   * Mettre à jour un produit
   */
  static update(id, productData) {
    const { title, price, description, image_url } = productData;
    
    const stmt = db.prepare(`
      UPDATE products 
      SET title = ?, price = ?, description = ?, image_url = ?
      WHERE id = ?
    `);

    stmt.run(title, price, description, image_url, id);
    return this.findById(id);
  }

  /**
   * Supprimer un produit
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    return stmt.run(id);
  }
}

export default Product;

