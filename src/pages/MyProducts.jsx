// ============================================
// src/pages/MyProducts.jsx
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/products/my-products');
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar tus productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      setDeleteModal({ show: false, product: null });
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              <i className="bi bi-box-seam text-primary me-2"></i>
              Mis Productos
            </h2>
            <p className="text-muted mb-0">Gestiona tu inventario</p>
          </div>
          <Link to="/products/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Producto
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando tus productos...</p>
          </div>
        )}

        {/* Lista de productos */}
        {!loading && products.length > 0 && (
          <div className="row g-4">
            {products.map(product => (
              <div key={product.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={product.image_url || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
                      className="card-img-top w-100 h-100 object-fit-cover"
                      alt={product.name}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      {product.stock === 0 ? (
                        <span className="badge bg-danger">Agotado</span>
                      ) : product.stock < 5 ? (
                        <span className="badge bg-warning text-dark">Poco stock</span>
                      ) : (
                        <span className="badge bg-success">Disponible</span>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title fw-bold text-truncate">{product.name}</h5>
                    <p className="card-text text-muted small text-truncate">{product.description}</p>

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
                        {product.stock} unid.
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="text-primary mb-0 fw-bold">{formatPrice(product.price)}</h4>
                    </div>

                    {/* Acciones */}
                    <div className="d-grid gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-eye me-1"></i>
                        Ver detalles
                      </Link>
                      <div className="btn-group">
                        <Link
                          to={`/products/edit/${product.id}`}
                          className="btn btn-warning btn-sm"
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, product })}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="bi bi-trash me-1"></i>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin productos */}
        {!loading && products.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '5rem' }}></i>
            <h3 className="mt-4">No tienes productos publicados</h3>
            <p className="text-muted mb-4">Comienza a vender creando tu primer producto</p>
            <Link to="/products/create" className="btn btn-primary btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Crear mi primer producto
            </Link>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {deleteModal.show && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                  Confirmar eliminación
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteModal({ show: false, product: null })}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  ¿Estás seguro de que deseas eliminar el producto <strong>{deleteModal.product?.name}</strong>?
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteModal({ show: false, product: null })}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(deleteModal.product.id)}
                >
                  <i className="bi bi-trash me-2"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;