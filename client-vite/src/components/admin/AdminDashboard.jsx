import React from 'react';

const AdminDashboard = ({ stats }) => {
  return (
    <div className="admin-dashboard">
      <h2>Общая статистика</h2>
      <div className="admin-stats-grid">
        <div className="admin-stat-card-large">
          <div className="admin-stat-icon">🛍️</div>
          <div className="admin-stat-content">
            <h3>Всего товаров</h3>
            <p className="admin-stat-number-large">{stats?.totalProducts || 0}</p>
          </div>
        </div>
        
        <div className="admin-stat-card-large">
          <div className="admin-stat-icon">📂</div>
          <div className="admin-stat-content">
            <h3>Категории</h3>
            <p className="admin-stat-number-large">{stats?.totalCategories || 0}</p>
          </div>
        </div>
        
        <div className="admin-stat-card-large">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-content">
            <h3>На складе</h3>
            <p className="admin-stat-number-large">{stats?.totalStock || 0}</p>
          </div>
        </div>
        
        <div className="admin-stat-card-large">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-content">
            <h3>В наличии</h3>
            <p className="admin-stat-number-large">{stats?.inStockProducts || 0}</p>
          </div>
        </div>
      </div>

      <div className="admin-quick-actions">
        <h3>Быстрые действия</h3>
        <div className="admin-actions-grid">
          <button className="admin-action-btn" onClick={() => window.scrollTo({ top: document.querySelector('.admin-nav').offsetTop + 100, behavior: 'smooth' })}>
            <span className="admin-action-icon">➕</span>
            Добавить товар
          </button>
          <button className="admin-action-btn">
            <span className="admin-action-icon">📂</span>
            Управление категориями
          </button>
          <button className="admin-action-btn">
            <span className="admin-action-icon">📊</span>
            Просмотреть заказы
          </button>
          <button className="admin-action-btn">
            <span className="admin-action-icon">👥</span>
            Управление пользователями
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;