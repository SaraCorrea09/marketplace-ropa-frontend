// ============================================
// src/pages/MyPurchases.jsx
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchMyPurchases();
  }, []);

  const fetchMyPurchases = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/orders/my-purchases');
      const ordersData = response.data;

      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const detailResponse = await api.get(`/orders/${order.id}`);
            const fullOrder = detailResponse.data;

            const productResponse = await api.get(`/products/${fullOrder.product_id}`);

            return {
              ...fullOrder,
              product: productResponse.data,
              seller: fullOrder.users   // 🔥 Mapeo correcto del vendedor
            };
          } catch (err) {
            console.error(`Error al cargar datos de orden ${order.id}:`, err);
            return order;
          }
        })
      );

      setOrders(ordersWithDetails);
    } catch (err) {
      setError('Error al cargar tus compras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const n = Number(price);
    if (isNaN(n)) return '$0';

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(n);
  };

  const getTotal = (order) => {
    const price = Number(order.product?.price);
    const qty = Number(order.quantity);
    if (isNaN(price) || isNaN(qty)) return 0;
    return price * qty;
  };

  const getImage = (product) => {
    if (!product) return null;
    return product.image_url || "https://via.placeholder.com/300x200?text=Sin+Imagen";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'bg-warning text-dark', text: 'Pendiente', icon: 'clock' },
      completed: { class: 'bg-success', text: 'Completada', icon: 'check-circle' },
      cancelled: { class: 'bg-danger', text: 'Cancelada', icon: 'x-circle' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`badge ${badge.class}`}>
        <i className={`bi bi-${badge.icon} me-1`}></i>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">

        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            <i className="bi bi-bag-check text-success me-2"></i>
            Mis Compras
          </h2>
          <p className="text-muted mb-0">Historial de tus pedidos</p>
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
            <p className="mt-3 text-muted">Cargando tus compras...</p>
          </div>
        )}

        {/* Lista de compras */}
        {!loading && orders.length > 0 && (
          <div className="row g-4">
            {orders.map(order => (
              <div key={order.id} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="row align-items-center">

                      {/* Imagen */}
                      <div className="col-md-2 position-relative">
                        <img
                          src={getImage(order.product)}
                          alt={order.product?.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "120px", objectFit: "cover", width: "100%" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
                          }}
                        />
                      </div>

                      {/* Información del producto */}
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold mb-0">{order.product?.name}</h5>
                          {getStatusBadge(order.status)}
                        </div>
              
                        <div className="d-flex gap-3 small text-muted">
                          <span>
                            <i className="bi bi-calendar me-1"></i>
                            {formatDate(order.created_at)}
                          </span>
                          <span>
                            <i className="bi bi-box me-1"></i>
                            Cantidad: {order.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Precio y acciones */}
                      <div className="col-md-4 text-md-end mt-3 mt-md-0">
                        <h4 className="text-primary fw-bold mb-3">
                          {formatPrice(getTotal(order))}
                        </h4>
                        <div className="d-grid gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver detalles
                          </button>
                          <Link
                            to={`/products/${order.product?.id}`}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            <i className="bi bi-box-seam me-1"></i>
                            Ver producto
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin compras */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
            <h3 className="mt-4">No tienes compras realizadas</h3>
            <p className="text-muted mb-4">Explora nuestro catálogo y encuentra lo que buscas</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <i className="bi bi-shop me-2"></i>
              Ver productos
            </Link>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-receipt me-2"></i>
                  Detalles de la Compra
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">

                  {/* Imagen modal */}
                  <div className="col-md-6 mb-3 text-center">
                    <img
                      src={getImage(selectedOrder.product)}
                      alt={selectedOrder.product?.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
                      }}
                    />
                  </div>

                  {/* Información */}
                  <div className="col-md-6">
                    <h4 className="fw-bold mb-3">{selectedOrder.product?.name || 'Producto'}</h4>

                    <div className="mb-3">
                      <strong>Estado:</strong> {getStatusBadge(selectedOrder.status)}
                    </div>

                    <div className="mb-2">
                      <strong>ID de compra:</strong> <span className="text-muted">#{selectedOrder.id}</span>
                    </div>

                    <div className="mb-2">
                      <strong>Cantidad:</strong> {selectedOrder.quantity} unidades
                    </div>

                    <div className="mb-2">
                      <strong>Precio unitario:</strong>
                      {selectedOrder.product?.price ? formatPrice(selectedOrder.product.price) : 'N/A'}
                    </div>

                    <div className="mb-3">
                      <strong>Total:</strong>
                      <span className="text-primary fs-4 ms-2">
                        {formatPrice(getTotal(selectedOrder))}
                      </span>
                    </div>

                    <div className="mb-2">
                      <strong>Fecha de compra:</strong><br />
                      {formatDate(selectedOrder.created_at)}
                    </div>

                    {/* Información del vendedor */}
                    {selectedOrder.seller && (
                      <div className="border-top pt-3 mt-3">
                        <h6 className="fw-bold mb-2">
                          <i className="bi bi-person-circle me-2"></i>
                          Información del vendedor
                        </h6>
                        <p className="mb-1"><strong>Nombre:</strong> {selectedOrder.seller.full_name}</p>
                        <p className="mb-1"><strong>Email:</strong> {selectedOrder.seller.email}</p>
                        <p className="mb-1"><strong>Teléfono:</strong> {selectedOrder.seller.phone}</p>
                        <p className="mb-0"><strong>Dirección:</strong> {selectedOrder.seller.address}</p>
                      </div>
                    )}

                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyPurchases;
