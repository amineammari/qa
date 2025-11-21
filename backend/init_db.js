/**
 * Script d'initialisation de la base de données
 * Crée les tables et insère les données de test (fake data)
 */
import db from './src/config/db.js';
import bcrypt from 'bcrypt';

console.log('🔄 Initialisation de la base de données EasyShop...\n');

try {
  // Supprimer les tables existantes (pour réinitialisation propre)
  console.log('📋 Suppression des anciennes tables...');
  db.exec(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
  `);

  // Créer les tables
  console.log('📋 Création des tables...');

  // Table users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table products
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table cart
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    )
  `);

  // Table orders
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Table order_items
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Tables créées avec succès\n');

  // Insérer les utilisateurs fake
  console.log('👥 Insertion des utilisateurs...');
  const users = [
    { name: 'Alice Dupont', email: 'alice@example.com', password: 'Password1!' },
    { name: 'Bob Martin', email: 'bob@example.com', password: 'Password2!' },
    { name: 'Charlie Roy', email: 'charlie@example.com', password: 'Password3!' }
  ];

  const insertUser = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  const userIds = {};

  for (const user of users) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const result = insertUser.run(user.name, user.email, hashedPassword);
    userIds[user.email] = result.lastInsertRowid;
    console.log(`  ✓ ${user.name} (${user.email}) - ID: ${result.lastInsertRowid}`);
  }

  console.log('✅ Utilisateurs insérés\n');

  // Insérer les produits fake
  console.log('📦 Insertion des produits...');
  const products = [
    { title: 'Casque Audio', price: 129.00, description: 'Casque bluetooth circum-aural' },
    { title: 'Clavier Mécanique', price: 89.00, description: 'Clavier AZERTY mécanique 87 touches' },
    { title: 'Souris Gaming', price: 49.00, description: 'Souris optique 16000 DPI' }
  ];

  const insertProduct = db.prepare('INSERT INTO products (title, price, description) VALUES (?, ?, ?)');
  const productIds = {};

  for (const product of products) {
    const result = insertProduct.run(product.title, product.price, product.description);
    productIds[product.title] = result.lastInsertRowid;
    console.log(`  ✓ ${product.title} - ${product.price}€ - ID: ${result.lastInsertRowid}`);
  }

  console.log('✅ Produits insérés\n');

  // Insérer des données de panier (Bob a 1 Casque, Alice a 2 Souris)
  console.log('🛒 Insertion des données de panier...');
  const insertCart = db.prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)');
  
  // Bob a 1 Casque Audio
  const casqueId = productIds['Casque Audio'];
  const bobId = userIds['bob@example.com'];
  insertCart.run(bobId, casqueId, 1);
  console.log(`  ✓ Bob a 1x Casque Audio dans son panier`);

  // Alice a 2 Souris Gaming
  const sourisId = productIds['Souris Gaming'];
  const aliceId = userIds['alice@example.com'];
  insertCart.run(aliceId, sourisId, 2);
  console.log(`  ✓ Alice a 2x Souris Gaming dans son panier`);

  console.log('✅ Panier initialisé\n');

  // Créer une commande exemple pour Alice
  console.log('📋 Création d\'une commande exemple...');
  const insertOrder = db.prepare('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)');
  const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
  
  // Commande pour Alice : 1 Clavier Mécanique
  const clavierId = productIds['Clavier Mécanique'];
  const clavierPrice = 89.00;
  const orderResult = insertOrder.run(aliceId, clavierPrice, 'completed');
  const orderId = orderResult.lastInsertRowid;
  insertOrderItem.run(orderId, clavierId, 1, clavierPrice);
  console.log(`  ✓ Commande #${orderId} créée pour Alice (1x Clavier Mécanique - ${clavierPrice}€)`);

  console.log('✅ Commande exemple créée\n');

  console.log('🎉 Base de données initialisée avec succès !\n');
  console.log('📊 Résumé:');
  console.log(`   - ${users.length} utilisateurs`);
  console.log(`   - ${products.length} produits`);
  console.log(`   - Données de panier pour 2 utilisateurs`);
  console.log(`   - 1 commande exemple\n`);

} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation:', error);
  process.exit(1);
} finally {
  db.close();
}

