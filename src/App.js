import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MyProducts from './pages/MyProducts';
import MyPurchases from './pages/MyPurchases';
import MySales from './pages/MySales';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="products/create" element={<CreateProduct />} />

          <Route 
            path="/my-products" 
            element={
              <ProtectedRoute>
                <MyProducts />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/products/edit/:id" 
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-purchases" 
            element={
              <ProtectedRoute>
                <MyPurchases />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-sales" 
            element={
              <ProtectedRoute>
                <MySales />
              </ProtectedRoute>
            } 
          />

          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={
              <div className="container py-5 text-center">
                <h1 className="display-1">404</h1>
                <p className="lead">Página no encontrada</p>
              </div>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
