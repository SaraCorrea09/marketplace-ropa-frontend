// ============================================
// src/pages/ProductDetail.jsx
// ============================================
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Error al cargar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (quantity > product.stock) {
      setError('No hay suficiente stock disponible');
      return;
    }

    setBuying(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/orders', {
        product_id: product.id,
        quantity: quantity
      });
      setSuccess('¡Compra realizada con éxito!');
      setTimeout(() => {
        navigate('/my-purchases');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al realizar la compra');
    } finally {
      setBuying(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
        <Link to="/products" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Volver a productos
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const isOwner = user && user.id === product.seller_id;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none">Productos</Link>
            </li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        {/* Alertas */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show">
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Imagen del producto */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <img
                  src={product.image_url || 'https://via.placeholder.com/600x600?text=Sin+Imagen'}
                  alt={product.name}
                  className="img-fluid w-100 rounded"
                  style={{ maxHeight: '600px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                {/* Título y estado */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h1 className="h2 fw-bold mb-0">{product.name}</h1>
                  {product.stock === 0 ? (
                    <span className="badge bg-danger">Agotado</span>
                  ) : product.stock < 5 ? (
                    <span className="badge bg-warning text-dark">¡Últimas unidades!</span>
                  ) : (
                    <span className="badge bg-success">Disponible</span>
                  )}
                </div>

                {/* Precio */}
                <div className="mb-4">
                  <h2 className="text-primary fw-bold mb-0">
                    {formatPrice(product.price)}
                  </h2>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-2">Descripción</h5>
                  <p className="text-muted">{product.description}</p>
                </div>

                {/* Detalles */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Detalles</h5>
                  <div className="row g-3">
                    {product.color && (
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-palette text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                          <div>
                            <small className="text-muted d-block">Color</small>
                            <span className="fw-semibold">{product.color}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {product.size && (
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-rulers text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                          <div>
                            <small className="text-muted d-block">Talla</small>
                            <span className="fw-semibold">{product.size}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-box text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                        <div>
                          <small className="text-muted d-block">Stock</small>
                          <span className="fw-semibold">{product.stock} unidades</span>
                        </div>
                      </div>
                    </div>

                    {product.category && (
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-tag text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                          <div>
                            <small className="text-muted d-block">Categoría</small>
                            <span className="fw-semibold">{product.category.name}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendedor */}
                {product.user && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h6 className="fw-bold mb-2">
                      <i className="bi bi-person-circle me-2"></i>
                      Vendedor
                    </h6>
                    <p className="mb-1">{product.user.full_name}</p>
                    <small className="text-muted">{product.user.address}</small>
                  </div>
                )}

                {/* Acciones */}
                {!isOwner && product.stock > 0 && (
                  <div className="border-top pt-4">
                    <div className="row g-3 align-items-center mb-3">
                      <div className="col-auto">
                        <label className="fw-semibold">Cantidad:</label>
                      </div>
                      <div className="col-auto">
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value))}
                          style={{ width: '100px' }}
                        />
                      </div>
                      <div className="col-auto">
                        <span className="text-muted">de {product.stock} disponibles</span>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        onClick={handleBuy}
                        className="btn btn-primary btn-lg"
                        disabled={buying || quantity > product.stock}
                      >
                        {buying ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cart-check me-2"></i>
                            Comprar ahora - {formatPrice(product.price * quantity)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {isOwner && (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Este es tu producto. No puedes comprarlo.
                  </div>
                )}

                {product.stock === 0 && !isOwner && (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Producto agotado
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;