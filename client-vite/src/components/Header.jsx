import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaList, FaUser, FaSignOutAlt, FaCrown } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { getCartItemsCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [textColor, setTextColor] = useState('white');

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  useEffect(() => {
    const currentPath = location.pathname;
    
    if (currentPath === '/admin' || currentPath === '/products' || currentPath === '/product/5' || currentPath === '/cart' || currentPath === '/checkout' || currentPath === '/login' || currentPath === '/register') {
      setTextColor('black');
    } else if (currentPath === '/') {
      setTextColor('white');
    } else {
      setTextColor('white');
    }
  }, [location.pathname]);

  const textStyle = {
    color: textColor
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1 style={textStyle}>AutoCore</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/" style={textStyle}>
            Главная
          </Link>
          <Link to="/products" style={textStyle}>
            Каталог
          </Link>
          
          {user ? (
            <>
              {isAdmin() && (
                <Link to="/admin" style={textStyle}>
                  Админ-панель
                </Link>
              )}
              
              <div className="user-menu">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={textStyle}
                >
                  {user.firstName}
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <strong>{user.firstName} {user.lastName}</strong>
                      <span>{user.email}</span>
                      {isAdmin() && <span className="admin-badge">Администратор</span>}
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                      <FaSignOutAlt /> Выйти
                    </button>
                  </div>
                )}
              </div>

              <>
                <Link to="/cart" className="cart-link" style={textStyle}>
                  Корзина
                  {getCartItemsCount() > 0 && (
                    <span className="cart-count">{getCartItemsCount()}</span>
                  )}
                </Link>
              </>  
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn" style={textStyle}>
                <FaUser /> Войти
              </Link>
            </>
          )}
      
        </nav>
      </div>
    </header>
  );
};

export default Header;