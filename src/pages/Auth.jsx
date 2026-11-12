// ------------------------------------------------------------
// Auth.jsx
// Login and signup page. Keeps all original JSX structure and
// classNames; wires up real API calls via useAuth and apiV1.
// ------------------------------------------------------------

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/common/Icon';
import Brand from '../components/layout/Brand';
import { IMAGES } from '../assets/images';
import { useAuth } from '../auth/AuthContext';
import { apiV1 } from '../api/index';

// ── Role label → backend role string mapping ──────────────────
// Keep UI labels separate from backend constants to allow
// label changes without touching API call sites.
const ROLE_MAP = {
  'Customer':         'customer',
  'Restaurant owner': 'restaurant',
  'Cashier':          'cashier',
};

// Role labels displayed in the selector (order matters for UI)
const ROLE_LABELS = Object.keys(ROLE_MAP);

// ── Post-login redirect per backend role ──────────────────────
const ROLE_REDIRECT = {
  customer:   '/',
  restaurant: '/dashboard',
  cashier:    '/dashboard',
  admin:      '/dashboard',
};

// Authentication page (Login / Signup)
export default function Auth() {
  const navigate = useNavigate();
  const auth = useAuth();

  // ── UI mode and role state ────────────────────────────────
  const [mode, setMode]   = useState('login');  // "login" | "signup"
  const [role, setRole]   = useState('Customer'); // UI label

  // ── Form field state ──────────────────────────────────────
  const [usernameOrEmail, setUsernameOrEmail]   = useState('');
  const [username, setUsername]                 = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [phoneNumber, setPhoneNumber]           = useState('');
  const [restaurantName, setRestaurantName]     = useState('');

  // ── Async / feedback state ────────────────────────────────
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ── Password visibility toggle ────────────────────────────
  const [showPassword, setShowPassword] = useState(false);

  // ── Switch between login and signup ──────────────────────
  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
    setSuccessMessage('');
  };

  // ── Login form submit ─────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // auth.login stores tokens and sets user in context
      const loggedInUser = await auth.login(usernameOrEmail, password);
      const destination = ROLE_REDIRECT[loggedInUser.role] ?? '/';
      navigate(destination);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Signup form submit ────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Build the payload; only include optional fields when non-empty
    const payload = {
      username,
      email,
      password,
      confirm_password: confirmPassword,
      role: ROLE_MAP[role],  // convert UI label to backend role string
      ...(phoneNumber ? { phone_number: phoneNumber } : {}),
      ...(ROLE_MAP[role] === 'restaurant' && restaurantName
        ? { restaurant_name: restaurantName }
        : {}),
    };

    try {
      await apiV1.post('/auth/register/', payload);
      // On success, switch to login and show a confirmation message
      setSuccessMessage('Account created! Please sign in.');
      setMode('login');
    } catch (err) {
      // Backend may return field-level errors; show first one found
      const data = err?.response?.data;
      const message =
        data?.detail ||
        data?.non_field_errors?.[0] ||
        (data && Object.values(data).flat()[0]) ||
        'Signup failed. Please check the form and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const submit = mode === 'login' ? handleLogin : handleSignup;

  return (
    <div className="auth-page">
      {/* ── Left art panel ── */}
      <div className="auth-art">
        <Brand light />
        <div className="auth-quote">
          <span className="sketch-label">YOUR TABLE IS WAITING</span>
          <h1>Good food brings<br /><em>good people</em><br />together.</h1>
          <p>Order, serve, or grow your kitchen—all from one thoughtful place.</p>
        </div>
        <img src={IMAGES.salad} alt="Fresh salad" />
        <span className="auth-index">QUORDA / 2025</span>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-wrap">
        <button className="back-link" onClick={() => navigate('/')}>← Back to discover</button>
        <div className="auth-form">

          {/* ── Heading ── */}
          <span className="eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'BECOME PART OF QUORDA'}</span>
          <h2>{mode === 'login' ? 'Sign in to your account.' : 'Create your account.'}</h2>
          <p>
            {mode === 'login' ? 'New around here?' : 'Already have an account?'}{' '}
            <button onClick={switchMode}>
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>

          {/* ── Role selector (I am a…) ── */}
          <div className="role-select">
            <span>I am a</span>
            <div>
              {ROLE_LABELS.map((label) => (
                <button
                  key={label}
                  className={role === label ? 'active' : ''}
                  onClick={() => setRole(label)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Success message (shown after successful signup) ── */}
          {successMessage && (
            <p className="auth-success">{successMessage}</p>
          )}

          {/* ── Form ── */}
          <form onSubmit={submit}>

            {/* Signup-only: Username */}
            {mode === 'signup' && (
              <label>
                Username
                <input
                  required
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            )}

            {/* Login-only: Username or Email; Signup: Email */}
            {mode === 'login' ? (
              <label>
                Username or Email
                <input
                  required
                  placeholder="Username or email address"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  autoComplete="username"
                />
              </label>
            ) : (
              <label>
                Email address
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>
            )}

            {/* Signup-only: Phone number (optional) */}
            {mode === 'signup' && (
              <label>
                Phone number <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                <input
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                />
              </label>
            )}

            {/* Signup-only: Restaurant name (only for restaurant role) */}
            {mode === 'signup' && ROLE_MAP[role] === 'restaurant' && (
              <label>
                Restaurant name
                <input
                  required
                  placeholder="Your restaurant's name"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </label>
            )}

            {/* Password field (shared) */}
            <label>
              Password
              <div className="password-input">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <span
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </span>
              </div>
            </label>

            {/* Signup-only: Confirm password */}
            {mode === 'signup' && (
              <label>
                Confirm password
                <input
                  required
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
            )}

            {/* Login-only: Remember me + Forgot password */}
            {mode === 'login' && (
              <div className="auth-options">
                <label><input type="checkbox" /> Remember me</label>
                <button type="button">Forgot password?</button>
              </div>
            )}

            {/* Submit button with loading state */}
            <button
              className="button primary auth-submit"
              disabled={loading}
            >
              {loading
                ? mode === 'login' ? 'Signing in…' : 'Creating account…'
                : mode === 'login' ? 'Sign in' : 'Create account'
              }
              {!loading && <Icon name="arrow" />}
            </button>
          </form>

          {/* ── Inline error message ── */}
          {error && <p className="auth-error">{error}</p>}

          {/* ── Trust badges ── */}
          <div className="auth-trust">
            <Icon name="check" /><span>Secure access</span>
            <Icon name="check" /><span>Role-based workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
