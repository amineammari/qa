/**
 * Service API - Configuration Axios et fonctions utilitaires
 */
import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fonctions API pour l'authentification
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email) => api.post('/auth/reset-password', { email })
};

// Fonctions API pour les produits
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`)
};

// Fonctions API pour le panier
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId, qty = 1) => api.post('/cart/add', { productId, qty }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  update: (productId, qty) => api.put('/cart/update', { productId, qty })
};

// Fonctions API pour les commandes
export const ordersAPI = {
  create: () => api.post('/orders'),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`)
};

export default api;

