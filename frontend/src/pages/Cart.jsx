import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import CartItem from '../components/CartItem';
import Button from '../components/Button';

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Chargement du panier...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Votre panier</h1>
        <p className="text-gray-600 mb-6">Votre panier est vide</p>
        <Button onClick={() => navigate('/')}>
          Continuer les achats
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Votre panier</h1>
      
      <div className="mb-6">
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} onUpdate={fetchCart} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total :</span>
          <span className="text-2xl font-bold text-blue-600">{cart.total}€</span>
        </div>
        <Button onClick={handleCheckout} className="w-full">
          Passer la commande
        </Button>
      </div>
    </div>
  );
}

export default Cart;

