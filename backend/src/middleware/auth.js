/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token JWT
 */
import jwt from 'jsonwebtoken';

/**
 * Middleware pour protéger les routes nécessitant une authentification
 */
export const authenticate = (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token manquant. Veuillez vous connecter.' 
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "
    const secret = process.env.JWT_SECRET || 'changeme_super_secret_key_for_jwt_tokens';

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, secret);
    
    // Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    return res.status(401).json({ error: 'Erreur d\'authentification' });
  }
};

/**
 * Middleware optionnel pour récupérer l'utilisateur si connecté (sans bloquer)
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET || 'changeme_super_secret_key_for_jwt_tokens';
      const decoded = jwt.verify(token, secret);
      req.user = {
        id: decoded.userId,
        email: decoded.email
      };
    }
  } catch (error) {
    // Ignorer les erreurs pour l'auth optionnelle
  }
  next();
};

