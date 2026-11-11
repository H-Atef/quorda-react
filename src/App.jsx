import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Icon from "./components/common/Icon";

// Layout wrapper (replaces Shell) managing sidebar state and rendering children
function AppLayout({ cart, toast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Keep sidebar state in sync with the viewport so the toggle behaves
  // normally when the window is shrunk or expanded.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const sync = () => {
      if (mq.matches) {
        setSidebarCollapsed(false); // collapse is a desktop concept
        setMobileOpen(false); // close the drawer when returning to desktop
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {mobileOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="main">
        <Topbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} cart={cart} />
        <Outlet />
        {/* Toast Notification */}
        {toast && (
          <div className="cart-toast">
            <Icon name="check" /> Added to your order
          </div>
        )}
      </main>
    </div>
  );
}

// Main application component managing global cart and toast state
export default function App() {
  const [cart, setCart] = useState(2);
  const [toast, setToast] = useState(false);

  const addToCart = () => {
    setCart(cart + 1);
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth page renders outside the main Shell layout */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<AppLayout cart={cart} addToCart={addToCart} toast={toast} setToast={setToast} />}>
          <Route index element={<Home addToCart={addToCart} />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}