// ============================================
// src/pages/Products.jsx
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    min_price: '',
    max_price: '',
    color: '',
    size: ''
  });

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  // Cargar productos
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      // Construir query params
      const params = new URLSearchParams();
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.color) params.append('color', filters.color);
      if (filters.size) params.append('size', filters.size);

      const response = await api.get(`/products?${params.toString()}`);
      let productsData = response.data;

      // Filtro de búsqueda local (por nombre)
      if (filters.search) {
        productsData = productsData.filter(product =>
          product.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setProducts(productsData);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      min_price: '',
      max_price: '',
      color: '',
      size: ''
    });
    setTimeout(() => fetchProducts(), 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <div className="bg-dark bg-dark shadow-sm text-white py-4">
        <div className="container">
          <h1 className="display-6 fw-bold mb-0">
            <i className="bi bi-shop me-3"></i>
            Catálogo de Productos
          </h1>
          <p className="mb-0 mt-2">Descubre las mejores ofertas en ropa</p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {/* Sidebar de Filtros */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-funnel me-2"></i>
                  Filtros
                </h5>
              </div>
              <div className="card-body">
                <div onSubmit={handleSearch}>
                  {/* Búsqueda */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-search me-1"></i>
                      Buscar
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="search"
                      placeholder="Nombre del producto..."
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </div>

                  {/* Categoría */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-tag me-1"></i>
                      Categoría
                    </label>
                    <select
                      className="form-select"
                      name="category_id"
                      value={filters.category_id}
                      onChange={handleFilterChange}
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rango de Precio */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-cash me-1"></i>
                      Precio
                    </label>
                    <div className="row g-2">
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="min_price"
                          placeholder="Mín"
                          value={filters.min_price}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="max_price"
                          placeholder="Máx"
                          value={filters.max_price}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Color */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-palette me-1"></i>
                      Color
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="color"
                      placeholder="Ej: Negro, Azul..."
                      value={filters.color}
                      onChange={handleFilterChange}
                    />
                  </div>

                  {/* Talla */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      <i className="bi bi-rulers me-1"></i>
                      Talla
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="size"
                      placeholder="Ej: M, L, 32..."
                      value={filters.size}
                      onChange={handleFilterChange}
                    />
                  </div>

                  {/* Botones */}
                  <div className="d-grid gap-2">
                    <button
                      onClick={handleSearch}
                      className="btn btn-primary"
                    >
                      <i className="bi bi-search me-2"></i>
                      Buscar
                    </button>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="col-lg-9">
            {/* Info de resultados */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">
                {loading ? 'Cargando...' : `${products.length} productos encontrados`}
              </h5>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando productos...</p>
              </div>
            )}

            {/* Grid de Productos */}
            {!loading && products.length > 0 && (
              <div className="row g-4">
                {products.map(product => (
                  <div key={product.id} className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm h-100 product-card">
                      {/* Imagen */}
                      <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                        <img
                          src={product.image_url || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}
                          className="card-img-top w-100 h-100 object-fit-cover"
                          alt={product.name}
                        />
                        {product.stock < 5 && product.stock > 0 && (
                          <span className="position-absolute top-0 start-0 badge bg-warning text-dark m-2">
                            ¡Pocas unidades!
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="position-absolute top-0 start-0 badge bg-danger m-2">
                            Agotado
                          </span>
                        )}
                      </div>

                      <div className="card-body">
                        <h5 className="card-title fw-bold text-truncate">
                          {product.name}
                        </h5>
                        <p className="card-text text-muted small text-truncate">
                          {product.description}
                        </p>

                        {/* Detalles */}
                        <div className="d-flex gap-2 mb-3 flex-wrap">
                          {product.color && (
                            <span className="badge bg-secondary">
                              <i className="bi bi-palette me-1"></i>
                              {product.color}
                            </span>
                          )}
                          {product.size && (
                            <span className="badge bg-secondary">
                              <i className="bi bi-rulers me-1"></i>
                              {product.size}
                            </span>
                          )}
                          <span className="badge bg-info">
                            <i className="bi bi-box me-1"></i>
                            Stock: {product.stock}
                          </span>
                        </div>

                        {/* Precio */}
                        <div className="d-flex justify-content-between align-items-center">
                          <h4 className="text-primary mb-0 fw-bold">
                            {formatPrice(product.price)}
                          </h4>
                          <Link
                            to={`/products/${product.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            Ver más
                            <i className="bi bi-arrow-right ms-1"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sin resultados */}
            {!loading && products.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-inbox text-muted" style={{ fontSize: '5rem' }}></i>
                <h3 className="mt-4">No se encontraron productos</h3>
                <p className="text-muted">Intenta ajustar los filtros de búsqueda</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Ver todos los productos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;