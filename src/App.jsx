// ------------------------------------------------------------
// App.jsx
// Root application component.
// AuthProvider wraps the router so auth context is available
// everywhere, including in route-level redirects triggered by
// logout (which needs window.location, not useNavigate).
// ------------------------------------------------------------

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// ── Layout components ─────────────────────────────────────────
import Sidebar from './components/layout/Sidebar';
import Topbar  from './components/layout/Topbar';
import Icon    from './components/common/Icon';

// ── Page components ───────────────────────────────────────────
import Home      from './pages/Home';
import Dashboard from './pages/Dashboard';
import Orders    from './pages/Orders';
import Products  from './pages/Products';
import Profile   from './pages/Profile';
import Auth      from './pages/Auth';

// ── Auth layer ────────────────────────────────────────────────
import { AuthProvider }  from './auth/AuthContext';
import ProtectedRoute    from './auth/ProtectedRoute';

// Roles that have access to the management/dashboard area
const MANAGEMENT_ROLES = ['restaurant', 'cashier', 'admin'];

// All authenticated roles (every role can view their own profile)
const ALL_ROLES = ['restaurant', 'cashier', 'admin', 'customer'];

// ── AppLayout ─────────────────────────────────────────────────
// Layout wrapper managing sidebar state and rendering child routes.
function AppLayout({ cart, toast }) {
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Keep sidebar state in sync with the viewport so the toggle behaves
  // normally when the window is shrunk or expanded.
  useEffect(() => {
    const mq   = window.matchMedia('(max-width: 760px)');
    const sync = () => {
      if (mq.matches) {
        setSidebarCollapsed(false); // collapse is a desktop concept
        setMobileOpen(false);       // close the drawer when returning to desktop
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
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

// ── App ───────────────────────────────────────────────────────
// Main application component managing global cart and toast state.
export default function App() {
  const [cart, setCart]   = useState(2);
  const [toast, setToast] = useState(false);

  const addToCart = () => {
    setCart((n) => n + 1);
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  };

  return (
    // AuthProvider is inside BrowserRouter so that the logout handler
    // in interceptors.js can safely use window.location.href = '/auth'
    // without needing access to React Router's navigate function.
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public: auth page renders outside the app shell ── */}
          <Route path="/auth" element={<Auth />} />

          {/* ── App shell wraps all other routes ── */}
          <Route
            path="/"
            element={<AppLayout cart={cart} addToCart={addToCart} toast={toast} setToast={setToast} />}
          >
            {/* Home is public – any visitor can browse */}
            <Route index element={<Home addToCart={addToCart} />} />

            {/* ── Protected: management routes (restaurant / cashier / admin) ── */}
            <Route element={<ProtectedRoute allowedRoles={MANAGEMENT_ROLES} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders"    element={<Orders />} />
              <Route path="products"  element={<Products />} />
            </Route>

            {/* ── Protected: profile (all authenticated roles) ── */}
            <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
