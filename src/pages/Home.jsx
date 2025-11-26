// ============================================
// src/pages/Home.jsx
// ============================================
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient text-white py-5" style={{
        background: 'black',
        minHeight: '500px'
      }}>
        <div className="container py-5" >
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-3 fw-bold mb-4">
                Bienvenido al Marketplace <br/>
                <span className="text-warning">GoBuy</span>
              </h1>
              <p className="lead mb-4">
                Compra y vende ropa de forma fácil y segura. Descubre las mejores ofertas o publica tus productos.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link to="/products" className="btn btn-success btn-lg shadow">
                  <i className="bi bi-shop me-2"></i>Ver Productos
                </Link>
                {user ? (
                  <Link to="/my-products" className="btn btn-warning btn-lg shadow">
                    <i className="bi bi-box-seam me-2"></i>Mis Productos
                  </Link>
                ) : (
                  <Link to="/register" className="btn btn-outline-info btn-lg shadow">
                    <i className="bi bi-rocket-takeoff me-2"></i>Comenzar
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <i className="bi bi-bag-heart-fill" style={{ fontSize: '15rem', opacity: 0.2 }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">¿Por qué elegirnos?</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4 hover-card">
              <div className="card-body">
                <div className="bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-search" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="card-title fw-bold">Busca y Filtra</h5>
                <p className="card-text text-muted">
                  Encuentra exactamente lo que necesitas con nuestros filtros avanzados por categoría, precio, color y talla.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4 hover-card">
              <div className="card-body">
                <div className="bg-success bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-cash-coin" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="card-title fw-bold">Vende Fácil</h5>
                <p className="card-text text-muted">
                  Publica tus productos en minutos. Gestiona tu inventario y ventas desde un solo lugar de forma sencilla.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4 hover-card">
              <div className="card-body">
                <div className="bg-warning bg-gradient text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-shield-check" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="card-title fw-bold">Compra Seguro</h5>
                <p className="card-text text-muted">
                  Sistema de órdenes confiable. Rastrea tus compras y mantén comunicación directa con los vendedores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Dashboard */}
      {user && (
        <div className="bg-light py-5">
          <div className="container">
            <div className="card border-0 shadow">
              <div className="card-body p-4">
                <h3 className="fw-bold mb-4">
                  <i className="bi bi-person-circle text-primary me-2"></i>
                  Hola, {user.full_name}
                </h3>
                <p className="text-muted mb-4">Acciones rápidas que puedes realizar:</p>
                
                <div className="row g-3">
                  <div className="col-md-4">
                    <Link to="/my-products" className="text-decoration-none">
                      <div className="card border-2 border-primary h-100 hover-scale">
                        <div className="card-body text-center p-4">
                          <i className="bi bi-box-seam text-primary" style={{ fontSize: '3rem' }}></i>
                          <h5 className="mt-3 fw-bold text-dark">Mis Productos</h5>
                          <p className="text-muted small mb-0">Gestiona tu inventario</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="col-md-4">
                    <Link to="/my-purchases" className="text-decoration-none">
                      <div className="card border-2 border-success h-100 hover-scale">
                        <div className="card-body text-center p-4">
                          <i className="bi bi-bag-check text-success" style={{ fontSize: '3rem' }}></i>
                          <h5 className="mt-3 fw-bold text-dark">Mis Compras</h5>
                          <p className="text-muted small mb-0">Ver tus pedidos</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="col-md-4">
                    <Link to="/my-sales" className="text-decoration-none">
                      <div className="card border-2 border-warning h-100 hover-scale">
                        <div className="card-body text-center p-4">
                          <i className="bi bi-graph-up-arrow text-warning" style={{ fontSize: '3rem' }}></i>
                          <h5 className="mt-3 fw-bold text-dark">Mis Ventas</h5>
                          <p className="text-muted small mb-0">Revisa tus ventas</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!user && (
        <div className="bg-dark text-white py-5">
          <div className="container text-center">
            <h2 className="fw-bold mb-4">¿Listo para empezar?</h2>
            <p className="lead mb-4">Únete a nuestra comunidad de compradores y vendedores</p>
            <Link to="/register" className="btn btn-warning btn-lg">
              <i className="bi bi-person-plus me-2"></i>
              Crear Cuenta Gratis
            </Link>
          </div>
        </div>
      )}

      {/* Estilos adicionales */}
      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }
        .hover-scale {
          transition: transform 0.3s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Home;