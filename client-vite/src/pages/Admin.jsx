import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import './css/Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Дашборд', icon: '📊' },
    { id: 'products', name: 'Товары', icon: '🛍️' },
    { id: 'categories', name: 'Категории', icon: '📂' }
  ];

  if (loading) {
    return <div className="admin-loading">Загрузка админки...</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <h1>Панель администратора</h1>
          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{stats?.totalProducts || 0}</span>
              <span className="stat-label"> Товаров</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats?.totalCategories || 0}</span>
              <span className="stat-label"> Категорий</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats?.totalStock || 0}</span>
              <span className="stat-label"> На складе</span>
            </div>
          </div>
        </header>

        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>

        <main className="admin-main">
          {activeTab === 'dashboard' && <AdminDashboard stats={stats} />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Admin;