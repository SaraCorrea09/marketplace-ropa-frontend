// ============================================
// src/components/Navbar.jsx
// ============================================
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-shop text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
          <span className="text-gradient">GoBuy</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                <i className="bi bi-grid me-1"></i>Productos
              </Link>
            </li>
            
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-products">
                    <i className="bi bi-box-seam me-1"></i>Mis Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-purchases">
                    <i className="bi bi-bag-check me-1"></i>Mis Compras
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-sales">
                    <i className="bi bi-cash-stack me-1"></i>Mis Ventas
                  </Link>
                </li>
                
                <li className="nav-item ms-lg-3">
                  <span className="navbar-text text-light me-3 d-none d-lg-inline">
                    <i className="bi bi-person-circle me-2"></i>
                    {user.full_name}
                  </span>
                </li>
                
                <li className="nav-item">
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-lg-2">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link to="/register" className="btn btn-warning btn-sm text-dark fw-semibold">
                    <i className="bi bi-person-plus me-1"></i>Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;