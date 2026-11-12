// ------------------------------------------------------------
// ProtectedRoute.jsx
// A route guard that enforces authentication and optional role checks.
// Use as a wrapper around any <Route> that requires a logged-in user.
// ------------------------------------------------------------

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute
 *
 * Props:
 *   allowedRoles?: string[]  — If provided, only users whose role is in
 *                              this array may pass. Others are redirected to /.
 *
 * Behaviour:
 *   • While session is being restored   → shows a full-page loading spinner
 *   • No authenticated user             → redirects to /auth
 *   • User role not in allowedRoles     → redirects to / (home)
 *   • All checks pass                   → renders nested <Outlet />
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // ── 1. Session restore in progress ───────────────────────
  // Render a spinner so we don't flash a redirect before the
  // async restore has had a chance to complete.
  if (loading) {
    return (
      <div className="auth-loading" aria-label="Loading session…">
        {/* A minimal CSS spinner; style via .auth-loading in your stylesheet */}
        <span className="auth-spinner" />
      </div>
    );
  }

  // ── 2. Not authenticated ──────────────────────────────────
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // ── 3. Role check (optional) ──────────────────────────────
  // If the route specifies allowed roles and the user's role isn't
  // among them, redirect them to the home page instead of showing a 403.
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ── 4. All good – render the protected child routes ───────
  return <Outlet />;
}
