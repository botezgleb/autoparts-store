import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import './css/Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    carBrand: ''
  })
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState('')
  
  const timeoutRef = useRef(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      fetchProducts()
    }, 500)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [filters.category, filters.brand, filters.carBrand])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.brand) params.append('brand', filters.brand)
      if (filters.carBrand) params.append('carBrand', filters.carBrand)

      console.log('Fetching products from:', `/api/products?${params}`)
      
      const response = await axios.get(`/api/products?${params}`)
      console.log('Products response:', response.data)
      
      if (response.data.products) {
        setProducts(response.data.products)
      } else if (Array.isArray(response.data)) {
        setProducts(response.data)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Ошибка загрузки товаров: ' + error.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)
      const response = await axios.get('/api/categories')
      console.log('Categories response:', response.data)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Ошибка загрузки категорий')
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  return (
    <div className="products-page">
      <div className="container">
        <div className='products-content'>
          <h1>Каталог автозапчастей</h1>
        
          <div className="filters">
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={categoriesLoading}
            >
              <option value="">Все категории</option>
              {categoriesLoading ? (
                <option disabled>Загрузка категорий...</option>
              ) : (
                categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>

            <input
              type="text"
              placeholder="Бренд запчасти"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />

            <input
              type="text"
              placeholder="Марка автомобиля"
              value={filters.carBrand}
              onChange={(e) => handleFilterChange('carBrand', e.target.value)}
            />
          </div>

          {categoriesLoading && (
            <div className="loading">Загрузка категорий...</div>
          )}

          {loading && products.length > 0 && (
            <div className="loading-indicator">Обновление списка...</div>
          )}

          {error && (
            <div><h1>Ошибка: {error}</h1></div>
          )}

          {loading && products.length === 0 && !categoriesLoading ? (
            <div className="loading">Загрузка товаров...</div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && !loading && (
                <div className="no-products">
                  <p>Товары не найдены</p>
                  <p>Попробуйте изменить параметры фильтрации</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products