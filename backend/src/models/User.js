/**
 * Modèle User - Gestion des utilisateurs
 */
import db from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
  /**
   * Créer un nouvel utilisateur
   */
  static create(userData) {
    const { name, email, password } = userData;
    
    // Vérifier si l'email existe déjà
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      throw new Error('Email déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `);

    const result = stmt.run(name, email, hashedPassword);
    return this.findById(result.lastInsertRowid);
  }

  /**
   * Trouver un utilisateur par ID
   */
  static findById(id) {
    const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  /**
   * Trouver un utilisateur par email
   */
  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  /**
   * Vérifier le mot de passe
   */
  static verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  /**
   * Obtenir tous les utilisateurs (pour admin)
   */
  static findAll() {
    const stmt = db.prepare('SELECT id, name, email, created_at FROM users');
    return stmt.all();
  }
}

export default User;

