import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    carBrand: '',
    carModel: '',
    year: '',
    quantity: '',
    categoryId: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/products?limit=100');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct.id}`, productData);
        toast.success('Товар обновлен');
      } else {
        await axios.post('/api/admin/products', productData);
        toast.success('Товар добавлен');
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        brand: '',
        carBrand: '',
        carModel: '',
        year: '',
        quantity: '',
        categoryId: '',
        image: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Ошибка сохранения товара');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      brand: product.brand,
      carBrand: product.carBrand,
      carModel: product.carModel,
      year: product.year,
      quantity: product.quantity,
      categoryId: product.categoryId,
      image: product.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      await axios.delete(`/api/admin/products/${productId}`);
      toast.success('Товар удален');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Ошибка удаления товара');
    }
  };

  return (
    <div className="admin-product-management">
      <div className="admin-section-header">
        <h2>Управление товарами</h2>
        <button 
          className="admin-btn-primary"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
            setFormData({
              name: '',
              description: '',
              price: '',
              brand: '',
              carBrand: '',
              carModel: '',
              year: '',
              quantity: '',
              categoryId: '',
              image: ''
            });
          }}
        >
          ➕ Добавить товар
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h3>
            <form onSubmit={handleSubmit} className="admin-product-form">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Название *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="admin-form-group">
                  <label>Бренд *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Цена *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Количество *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Марка авто *</label>
                  <input
                    type="text"
                    value={formData.carBrand}
                    onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Модель авто *</label>
                  <input
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Год</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    placeholder="2015-2020"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Категория *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group full-width">
                  <label>Описание</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="admin-form-group full-width">
                  <label>Изображение (URL)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="admin-btn-primary">
                  {editingProduct ? 'Обновить' : 'Добавить'}
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

      {loading ? (
        <div className="admin-loading">Загрузка товаров...</div>
      ) : (
        <div className="admin-products-table">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Бренд</th>
                <th>Цена</th>
                <th>Количество</th>
                <th>Автомобиль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-info">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="admin-product-thumb" />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.brand}</td>
                  <td>${product.price}</td>
                  <td>
                    <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>{product.carBrand} {product.carModel}</td>
                  <td>
                    <div className="admin-action-buttons">
                      <button 
                        className="admin-btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="admin-btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;