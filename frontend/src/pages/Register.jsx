import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authAPI.register(registerData);
      const { token, user } = response.data;

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Rediriger vers la page d'accueil
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Inscription</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Nom complet"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Mot de passe"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={loading} className="w-full mb-4">
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </Button>
      </form>

      <div className="text-center">
        <Link to="/login" className="text-blue-600 hover:underline">
          Déjà un compte ? Connectez-vous
        </Link>
      </div>
    </div>
  );
}

export default Register;

