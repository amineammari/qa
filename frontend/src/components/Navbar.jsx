import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer l'utilisateur depuis localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            🛒 EasyShop
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-blue-200 transition">
              Accueil
            </Link>
            
            {user ? (
              <>
                <Link to="/cart" className="hover:text-blue-200 transition">
                  🛒 Panier
                </Link>
                <span className="text-blue-200">Bonjour, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

