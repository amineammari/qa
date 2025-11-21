import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, cartAPI } from '../services/api';
import Button from '../components/Button';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await cartAPI.add(product.id, quantity);
      alert('Produit ajouté au panier !');
      navigate('/cart');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-200 flex items-center justify-center h-64 md:h-auto">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-8xl">📦</span>
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">{product.price}€</span>
            </div>
            
            {user && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Quantité
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {user ? (
              <Button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full"
              >
                {adding ? 'Ajout en cours...' : 'Ajouter au panier'}
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Connectez-vous pour ajouter au panier
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

