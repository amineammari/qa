import { cartAPI } from '../services/api';

function CartItem({ item, onUpdate }) {
  const handleQuantityChange = async (newQty) => {
    try {
      await cartAPI.update(item.product_id, newQty);
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la quantité');
    }
  };

  const handleRemove = async () => {
    try {
      await cartAPI.remove(item.product_id);
      onUpdate();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-gray-600 text-sm">{item.description}</p>
        <p className="text-blue-600 font-bold mt-2">{item.price}€ × {item.quantity} = {item.subtotal.toFixed(2)}€</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded"
          >
            +
          </button>
        </div>
        
        <button
          onClick={handleRemove}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default CartItem;

