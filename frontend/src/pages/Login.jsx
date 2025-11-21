import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Rediriger vers la page d'accueil
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <Button type="submit" disabled={loading} className="w-full mb-4">
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <div className="text-center">
        <Link to="/register" className="text-blue-600 hover:underline">
          Pas encore de compte ? Inscrivez-vous
        </Link>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600 mb-2">Comptes de test :</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>alice@example.com / Password1!</li>
          <li>bob@example.com / Password2!</li>
          <li>charlie@example.com / Password3!</li>
        </ul>
      </div>
    </div>
  );
}

export default Login;

