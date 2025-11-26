// ============================================
// src/pages/CreateProduct.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe id, es edición
  const isEditing = !!id;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    color: '',
    size: '',
    stock: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const fetchProduct = async () => {
    setLoadingProduct(true);
    try {
      const response = await api.get(`/products/${id}`);
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        color: product.color || '',
        size: product.size || '',
        stock: product.stock,
        image_url: product.image_url || ''
      });
      setImagePreview(product.image_url || '');
    } catch (err) {
      setError('Error al cargar el producto. Verifica que el ID sea correcto.');
      console.error(err);
    } finally {
      setLoadingProduct(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await api.post('/upload/image', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData({
        ...formData,
        image_url: response.data.image_url
      });
      setImagePreview(response.data.image_url);
    } catch (err) {
      setError('Error al subir la imagen');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.name || !formData.description || !formData.price || !formData.category_id || !formData.stock) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    if (formData.price <= 0 || formData.stock < 0) {
      setError('El precio debe ser mayor a 0 y el stock no puede ser negativo');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        stock: parseInt(formData.stock)
      };

      if (isEditing) {
        await api.put(`/products/${id}`, dataToSend);
      } else {
        await api.post('/products', dataToSend);
      }

      navigate('/my-products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-4">
                <h2 className="fw-bold mb-0">
                  <i className="bi bi-box-seam text-primary me-2"></i>
                  {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h2>
              </div>

              <div className="card-body p-4">
                {/* Loading cuando está cargando el producto para editar */}
                {loadingProduct && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 text-muted">Cargando producto...</p>
                  </div>
                )}

                {!loadingProduct && (
                  <>
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                      </div>
                    )}

                <div onSubmit={handleSubmit}>
                  {/* Imagen */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      <i className="bi bi-image me-2"></i>
                      Imagen del producto
                    </label>
                    
                    {imagePreview && (
                      <div className="mb-3 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && (
                      <div className="text-primary mt-2">
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Subiendo imagen...
                      </div>
                    )}
                    <small className="text-muted d-block mt-1">
                      Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB
                    </small>
                  </div>

                  <div className="row">
                    {/* Nombre */}
                    <div className="col-md-8 mb-3">
                      <label className="form-label fw-bold">
                        Nombre del producto <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Ej: Camiseta Nike Original"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Categoría */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Categoría <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecciona...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Descripción <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      placeholder="Describe tu producto..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    {/* Precio */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Precio (COP) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        placeholder="0"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>

                    {/* Stock */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Stock <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="stock"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>

                    {/* Color */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">Color</label>
                      <input
                        type="text"
                        className="form-control"
                        name="color"
                        placeholder="Ej: Negro, Azul"
                        value={formData.color}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Talla */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">Talla</label>
                    <input
                      type="text"
                      className="form-control"
                      name="size"
                      placeholder="Ej: M, L, 32, 34"
                      value={formData.size}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Botones */}
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/my-products')}
                      className="btn btn-outline-secondary"
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary flex-grow-1"
                      disabled={loading || uploading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          {isEditing ? 'Actualizar Producto' : 'Crear Producto'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;