import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { ProductDetail } from "./pages/ProductDetail";
import { CategoryPage } from "./pages/Category";
import { CartPage } from "./pages/Cart";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0d1117]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
}
