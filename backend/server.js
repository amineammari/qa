/**
 * Serveur Express pour EasyShop API
 * Point d'entrée principal de l'application backend
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import cartRoutes from './src/routes/cart.js';
import orderRoutes from './src/routes/orders.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Autoriser les requêtes depuis le frontend
app.use(express.json()); // Parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Parser les formulaires

// Middleware de logging (simple)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Route de santé (health check)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EasyShop API is running',
    timestamp: new Date().toISOString()
  });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({ 
    error: 'Erreur serveur interne',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur EasyShop démarré sur http://localhost:${PORT}`);
  console.log(`📦 API disponible sur http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

