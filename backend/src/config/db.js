/**
 * Configuration de la base de données SQLite
 * Utilise better-sqlite3 pour de meilleures performances
 */
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier de base de données
const dbPath = path.join(__dirname, '../../data/easyshop.db');

// Créer le dossier data s'il n'existe pas
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Créer et configurer la connexion à la base de données
const db = new Database(dbPath);

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

// Optimisations pour SQLite
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

console.log('✅ Base de données SQLite connectée:', dbPath);

export default db;

