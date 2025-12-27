import { Route, Routes } from "react-router-dom";
import "./global.css";
import NotFound from "./pages/404";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./component/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
