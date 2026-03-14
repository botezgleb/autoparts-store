import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Вход выполнен успешно!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Вход в аккаунт</h1>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="your@email.com"
              />
            </div>
            
            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="Введите пароль"
              />
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;