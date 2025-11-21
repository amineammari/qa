import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, ordersAPI } from '../services/api';
import Button from '../components/Button';

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

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

  const handleSubmitOrder = async () => {
    if (!cart || cart.items.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ordersAPI.create();
      setOrderCreated(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold mb-4 text-green-600">Commande confirmée !</h1>
        <p className="text-gray-600 mb-6">
          Votre commande a été créée avec succès. Vous allez être redirigé...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-6">Votre panier est vide</p>
        <Button onClick={() => navigate('/')}>
          Continuer les achats
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Récapitulatif de la commande</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Articles</h2>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">
                {item.price}€ × {item.quantity}
              </p>
            </div>
            <p className="font-semibold">{item.subtotal.toFixed(2)}€</p>
          </div>
        ))}
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total :</span>
            <span className="text-2xl font-bold text-blue-600">{cart.total}€</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
        <p className="text-sm text-yellow-800">
          ⚠️ Ceci est un prototype. Aucun paiement réel ne sera effectué.
        </p>
      </div>

      <Button
        onClick={handleSubmitOrder}
        disabled={submitting}
        className="w-full"
      >
        {submitting ? 'Traitement...' : 'Confirmer la commande'}
      </Button>
    </div>
  );
}

export default Checkout;

