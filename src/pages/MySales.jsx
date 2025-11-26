// ============================================
// src/pages/MySales.jsx
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MySales = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchMySales();
  }, []);

  const fetchMySales = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/orders/my-sales');
      const ordersData = response.data;
      
      // Cargar detalles completos de cada orden
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const detailResponse = await api.get(`/orders/${order.id}`);
            const fullOrder = detailResponse.data;

            const productResponse = await api.get(`/products/${fullOrder.product_id}`);

            return {
              ...fullOrder,
              product: productResponse.data
            };
          } catch (err) {
            console.error(`Error al cargar orden ${order.id}:`, err);
            return order;
          }
        })
      );

      setOrders(ordersWithDetails);

      // Calcular estadísticas (precio real)
      const totalOrders = ordersWithDetails.length;
      const pendingOrders = ordersWithDetails.filter(o => o.status === 'pending').length;
      const completedOrders = ordersWithDetails.filter(o => o.status === 'completed').length;
      const totalRevenue = ordersWithDetails.reduce(
        (sum, o) => sum + ((o.product?.price || 0) * (o.quantity || 1)),
        0
      );

      setStats({
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        revenue: totalRevenue
      });
    } catch (err) {
      setError('Error al cargar tus ventas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price || 0);
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
            <i className="bi bi-graph-up-arrow text-primary me-2"></i>
            Mis Ventas
          </h2>
          <p className="text-muted mb-0">Gestiona tus ventas y pedidos</p>
        </div>

        {/* Estadísticas */}
        {!loading && orders.length > 0 && (
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-receipt text-primary" style={{ fontSize: '2rem' }}></i>
                  <h3 className="fw-bold mt-2 mb-0">{stats.total}</h3>
                  <p className="text-muted small mb-0">Total Ventas</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-clock-history text-warning" style={{ fontSize: '2rem' }}></i>
                  <h3 className="fw-bold mt-2 mb-0">{stats.pending}</h3>
                  <p className="text-muted small mb-0">Pendientes</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                  <h3 className="fw-bold mt-2 mb-0">{stats.completed}</h3>
                  <p className="text-muted small mb-0">Completadas</p>
                </div>
              </div>
            </div>

  
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando tus ventas...</p>
          </div>
        )}

        {/* Lista de ventas */}
        {!loading && orders.length > 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-list-ul me-2"></i>
                Historial de Ventas
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Total</th>
                      <th className="text-center">Estado</th>
                      <th className="text-center">Fecha</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {order.product?.image_url && (
                              <img
                                src={order.product.image_url}
                                alt={order.product?.name}
                                className="rounded me-2"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}

                            {!order.product?.image_url && (
                              <div 
                                className="bg-light rounded me-2 d-flex align-items-center justify-content-center"
                                style={{ width: '50px', height: '50px' }}
                              >
                                <i className="bi bi-image text-muted"></i>
                              </div>
                            )}

                            <div>
                              <div className="fw-semibold">{order.product?.name || 'Producto'}</div>
                              <small className="text-muted">ID: {order.id}</small>
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          <span className="badge bg-secondary">{order.quantity || 0}</span>
                        </td>

                        <td className="text-end fw-bold text-primary">
                          {formatPrice((order.product?.price || 0) * (order.quantity || 1))}
                        </td>

                        <td className="text-center">
                          {getStatusBadge(order.status)}
                        </td>

                        <td className="text-center">
                          <small>{formatDate(order.created_at)}</small>
                        </td>

                        <td className="text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-cart-x text-muted" style={{ fontSize: '5rem' }}></i>
            <h3 className="mt-4">No tienes ventas registradas</h3>
            <p className="text-muted mb-4">Publica productos para comenzar a vender</p>
            <Link to="/products/create" className="btn btn-primary btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Crear producto
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
                  Detalles de la Venta
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    {selectedOrder.product?.image_url ? (
                      <img
                        src={selectedOrder.product.image_url}
                        alt={selectedOrder.product?.name}
                        className="img-fluid rounded"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div 
                        className="bg-light rounded d-flex align-items-center justify-content-center"
                        style={{ height: '300px' }}
                      >
                        <i className="bi bi-image text-muted" style={{ fontSize: '4rem' }}></i>
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <h4 className="fw-bold mb-3">{selectedOrder.product?.name || 'Producto'}</h4>

                    <div className="mb-3">
                      <strong>Estado:</strong> {getStatusBadge(selectedOrder.status)}
                    </div>
                    
                    <div className="mb-2">
                      <strong>ID de venta:</strong> <span className="text-muted">#{selectedOrder.id}</span>
                    </div>

                    <div className="mb-2">
                      <strong>Cantidad vendida:</strong> {selectedOrder.quantity} unidades
                    </div>

                    <div className="mb-2">
                      <strong>Precio unitario:</strong> {formatPrice(selectedOrder.product?.price)}
                    </div>

                    <div className="mb-3">
                      <strong>Total de la venta:</strong>
                      <span className="text-success fs-4 ms-2">
                        {formatPrice((selectedOrder.product?.price || 0) * (selectedOrder.quantity || 1))}
                      </span>
                    </div>

                    <div className="mb-2">
                      <strong>Fecha de venta:</strong><br/>
                      {formatDate(selectedOrder.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
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

export default MySales;
