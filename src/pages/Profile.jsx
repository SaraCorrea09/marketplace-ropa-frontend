// ============================================
// src/pages/Profile.jsx
// ============================================

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Cargando perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '100px', height: '100px' }}
              >
                <i className="bi bi-person-fill" style={{ fontSize: '3rem' }}></i>
              </div>
              <h2 className="fw-bold">Mi Perfil</h2>
            </div>

            {/* Card Perfil */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-person-badge me-2"></i>
                  Información Personal
                </h5>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted mb-1 d-block">
                        <i className="bi bi-person me-1"></i>
                        Nombre Completo
                      </small>
                      <h6 className="mb-0">{user.full_name}</h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted mb-1 d-block">
                        <i className="bi bi-envelope me-1"></i>
                        Email
                      </small>
                      <h6 className="mb-0">{user.email}</h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted mb-1 d-block">
                        <i className="bi bi-telephone me-1"></i>
                        Teléfono
                      </small>
                      <h6 className="mb-0">{user.phone}</h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted mb-1 d-block">
                        <i className="bi bi-geo-alt me-1"></i>
                        Dirección
                      </small>
                      <h6 className="mb-0">{user.address}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Información cuenta */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-info-circle me-2"></i>
                  Información de Cuenta
                </h5>
              </div>

              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                        <i className="bi bi-shield-check text-primary" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">ID de Usuario</small>
                        <strong>#{user.id}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                        <i className="bi bi-calendar-check text-success" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <small className="text-muted d-block">Miembro desde</small>
                        <strong>
                          {new Date(user.created_at || Date.now()).toLocaleDateString('es-CO')}
                        </strong>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
