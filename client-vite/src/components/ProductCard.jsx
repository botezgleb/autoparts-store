import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img 
          src={product.image || '/images/placeholder.jpg'} 
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-brand">Бренд: {product.brand}</p>
          <p className="product-car">Для: {product.carBrand} {product.carModel}</p>
          <p className="product-year">Год: {product.year}</p>
          <div className="product-price">${product.price}</div>
          <div className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </div>
        </div>
      </Link>
      {product.inStock && (
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          В корзину
        </button>
      )}
    </div>
  );
};

export default ProductCard;