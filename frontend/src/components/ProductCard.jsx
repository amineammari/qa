import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-400 text-4xl">📦</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">{product.price}€</span>
          <Link
            to={`/product/${product.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

