import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Ошибка загрузки категорий');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/admin/categories/${editingCategory.id}`, formData);
        toast.success('Категория обновлена');
      } else {
        await axios.post('/api/admin/categories', formData);
        toast.success('Категория добавлена');
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Ошибка сохранения категории');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;

    try {
      await axios.delete(`/api/admin/categories/${categoryId}`);
      toast.success('Категория удалена');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Ошибка удаления категории');
    }
  };

  return (
    <div className="admin-category-management">
      <div className="admin-section-header">
        <h2>Управление категориями</h2>
        <button 
          className="admin-btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setShowForm(true);
            setFormData({ name: '', description: '' });
          }}
        >
          ➕ Добавить категорию
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}</h3>
            <form onSubmit={handleSubmit} className="admin-category-form">
              <div className="admin-form-group">
                <label>Название категории *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="Описание категории..."
                />
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-primary">
                  {editingCategory ? 'Обновить' : 'Добавить'}
                </button>
                <button 
                  type="button" 
                  className="admin-btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-categories-grid">
        {categories.map(category => (
          <div key={category.id} className="admin-category-card">
            <div className="admin-category-header">
              <h3>{category.name}</h3>
              <div className="admin-category-actions">
                <button 
                  className="admin-btn-edit"
                  onClick={() => handleEdit(category)}
                >
                  ✏️
                </button>
                <button 
                  className="admin-btn-delete"
                  onClick={() => handleDelete(category.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
            {category.description && (
              <p className="admin-category-description">{category.description}</p>
            )}
            <div className="admin-category-stats">
              <span>Товаров: {category.products ? category.products.length : 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;