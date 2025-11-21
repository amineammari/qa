/**
 * Contrôleur d'authentification
 * Gère l'inscription, la connexion, la déconnexion et la réinitialisation de mot de passe
 */
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validations basiques
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis (name, email, password)' 
      });
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    // Validation mot de passe (minimum 6 caractères)
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }

    // Créer l'utilisateur
    const user = User.create({ name, email, password });

    // Générer un token JWT
    const secret = process.env.JWT_SECRET || 'changeme_super_secret_key_for_jwt_tokens';
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.message === 'Email déjà utilisé') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
};

/**
 * Connexion d'un utilisateur
 * POST /api/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email et mot de passe requis' 
      });
    }

    // Trouver l'utilisateur
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isValidPassword = User.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const secret = process.env.JWT_SECRET || 'changeme_super_secret_key_for_jwt_tokens';
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
};

/**
 * Déconnexion (mock - côté client)
 * POST /api/logout
 */
export const logout = async (req, res) => {
  // En production, on pourrait invalider le token côté serveur
  // Pour ce prototype, on retourne simplement un message
  res.json({ message: 'Déconnexion réussie. Supprimez le token côté client.' });
};

/**
 * Réinitialisation de mot de passe (mock)
 * POST /api/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = User.findByEmail(email);
    if (!user) {
      // Pour la sécurité, on ne révèle pas si l'email existe
      return res.json({ 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' 
      });
    }

    // En production, on enverrait un email avec un token de réinitialisation
    res.json({ 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
      note: 'Fonctionnalité mock - aucun email réellement envoyé'
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

