import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './css/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
    console.log(product);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!product) {
    return <div className="error">Товар не найден</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-content">
          <div className="product-image-section">
            <img 
              src={product.image || '/images/placeholder.jpg'} 
              alt={product.name}
              className="product-detail-image"
            />
          </div>
          
          <div className="product-info-section">
            <h1>{product.name}</h1>
            
            <div className="product-meta">
              <p className="brand">Бренд: <strong>{product.brand}</strong></p>
              <p className="car-info">
                Для: <strong>{product.carBrand} {product.carModel}</strong>
                {product.year && <span> ({product.year})</span>}
              </p>
            </div>

            <p className="description">{product.description}</p>
            
            <div className="price-section">
              <div className="price">${product.price}</div>
              <div className={`stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
              </div>
            </div>
            
            {product.inStock && (
              <button className="add-to-cart-btn large" onClick={handleAddToCart}>
                Добавить в корзину
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;