// ============================================
// src/pages/EditProduct.jsx
// ============================================
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    color: "",
    size: "",
    stock: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Cargar producto
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Subir imagen a la API
  const uploadImage = async () => {
    if (!imageFile) return product.image_url;

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.image_url;
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let uploadedImageUrl = product.image_url;

      if (imageFile) uploadedImageUrl = await uploadImage();

      const updatedProduct = {
        ...product,
        image_url: uploadedImageUrl,
        price: Number(product.price),
        stock: Number(product.stock),
      };

      await api.put(`/products/${id}`, updatedProduct);

      navigate("/my-products");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <h2 className="fw-bold mb-3">
          <i className="bi bi-pencil-square text-warning me-2"></i>
          Editar Producto
        </h2>
        <p className="text-muted">Actualizar información del producto</p>

        {/* Error */}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
            <p className="mt-3 text-muted">Cargando producto...</p>
          </div>
        ) : (
          <div className="card shadow-sm border-0 p-4">
            <form onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="mb-3">
                <label className="form-label fw-bold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  required
                />
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <label className="form-label fw-bold">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Precio / Stock */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Precio</label>
                  <input
                    type="number"
                    className="form-control"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={product.stock}
                    onChange={(e) =>
                      setProduct({ ...product, stock: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Color / Talla */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.color}
                    onChange={(e) =>
                      setProduct({ ...product, color: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Talla</label>
                  <input
                    type="text"
                    className="form-control"
                    value={product.size}
                    onChange={(e) =>
                      setProduct({ ...product, size: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Categoría */}
              <div className="mb-3">
                <label className="form-label fw-bold">Categoría ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={product.category_id}
                  onChange={(e) =>
                    setProduct({ ...product, category_id: e.target.value })
                  }
                  required
                />
              </div>

              {/* Imagen */}
              <div className="mb-3">
                <label className="form-label fw-bold">Imagen</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>

              {/* Vista previa */}
              <div className="text-center mb-4">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : product.image_url ||
                        "https://via.placeholder.com/300x200?text=Sin+Imagen"
                  }
                  alt="preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: 200 }}
                />
              </div>

              {/* Botones */}
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/my-products")}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-warning"
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
