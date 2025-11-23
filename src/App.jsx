import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { publicRoutes, userRoutes, adminRoutes } from "./routes";
import useSmoothScroll from "./hooks/useSmoothScroll";

function App() {
  useSmoothScroll();

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            {publicRoutes}

            {/* Protected User Routes */}
            {userRoutes}

            {/* Admin Routes */}
            {adminRoutes}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
