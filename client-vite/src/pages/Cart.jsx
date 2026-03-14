import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Корзина</h1>
          <div className="empty-cart">
            <p>Ваша корзина пуста</p>
            <Link to="/products" className="continue-shopping">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Корзина</h1>
        
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.image || '/images/placeholder.jpg'} 
                alt={item.name}
                className="cart-item-image"
              />
              
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.brand} - {item.carBrand} {item.carModel}</p>
                <div className="cart-item-price">${item.price}</div>
              </div>
              
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="cart-total">
            <h3>Итого: ${getCartTotal().toFixed(2)}</h3>
          </div>
          
          <div className="cart-actions">
            <button className="clear-cart-btn" onClick={clearCart}>
              Очистить корзину
            </button>
            <Link to="/checkout" className="checkout-btn">
              Оформить заказ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;