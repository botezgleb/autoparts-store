import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Контексты
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Компоненты
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Страницы
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';

// Стили
import './App.css';
import './pages/Auth.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;