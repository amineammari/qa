/**
 * Configuration globale pour les tests Jest
 */
import dotenv from 'dotenv';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Configuration par défaut pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
process.env.DB_FILE = process.env.DB_FILE || './data/test.db';

