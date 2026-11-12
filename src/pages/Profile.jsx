// ------------------------------------------------------------
// Profile.jsx
// Account & settings page. Fetches real user data from the API,
// keeps all original classNames and structure intact.
// ------------------------------------------------------------

import { useEffect, useState } from 'react';
import Icon from '../components/common/Icon';
import { useAuth } from '../auth/AuthContext';
import { apiV1 } from '../api/index';

// ── Role → readable badge label mapping ───────────────────────
const ROLE_LABELS = {
  admin:      'ADMIN',
  restaurant: 'RESTAURANT OWNER',
  cashier:    'CASHIER',
  customer:   'CUSTOMER',
};

// ── Helper: format an ISO date string as "Month YYYY" ─────────
function formatMemberSince(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'long',
    year:  'numeric',
  });
}

// ── Helper: derive initials (first 2 chars uppercase) ─────────
function getInitials(username) {
  if (!username) return '??';
  return username.slice(0, 2).toUpperCase();
}

// User profile and restaurant settings page
export default function Profile() {
  const auth = useAuth();

  // ── Personal info state ───────────────────────────────────
  const [userData, setUserData] = useState(null); // full /users/me/ response

  // Controlled form fields for personal info
  const [username, setUsername]       = useState('');
  const [email, setEmail]             = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // ── Restaurant profile state (restaurant role only) ───────
  const [profileData, setProfileData]           = useState(null);
  const [restaurantName, setRestaurantName]     = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantDesc, setRestaurantDesc]     = useState('');

  // ── Async / feedback state ────────────────────────────────
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');

  // ── Fetch user (and optionally restaurant profile) on mount ─
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      try {
        // Always fetch the full user profile
        const { data: me } = await apiV1.get('/users/me/');
        setUserData(me);
        setUsername(me.username    ?? '');
        setEmail(me.email          ?? '');
        setPhoneNumber(me.phone_number ?? '');

        // If the user is a restaurant owner, also fetch the restaurant profile
        if (me.role === 'restaurant') {
          try {
            const { data: rp } = await apiV1.get('/restaurant-profiles/');
            // Backend may return a list (paginated) or a single object
            const profile = Array.isArray(rp) ? rp[0] : rp;
            setProfileData(profile ?? null);
            setRestaurantName(profile?.restaurant_name ?? '');
            setRestaurantAddress(profile?.address      ?? '');
            setRestaurantDesc(profile?.description     ?? '');
          } catch {
            // Non-critical – don't block the whole page on this
            setProfileData(null);
          }
        }
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
          'Failed to load profile. Please refresh the page.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle personal info form submit ─────────────────────
  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { data: updated } = await apiV1.patch('/users/me/', {
        username,
        email,
        phone_number: phoneNumber,
      });

      // Keep local state and global auth context in sync
      setUserData((prev) => ({ ...prev, ...updated }));
      auth.updateUser(updated);

      // Show "saved" confirmation briefly
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.detail ||
        (data && Object.values(data).flat()[0]) ||
        'Failed to save changes.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Handle restaurant profile form submit ─────────────────
  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { data: updated } = await apiV1.patch('/restaurant-profiles/', {
        restaurant_name: restaurantName,
        address:         restaurantAddress,
        description:     restaurantDesc,
      });

      setProfileData((prev) => ({ ...prev, ...updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to save restaurant details.');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="page profile-page">
        <p className="profile-loading">Loading profile…</p>
      </div>
    );
  }

  // ── Derived display values ────────────────────────────────
  const initials   = getInitials(userData?.username);
  const roleBadge  = ROLE_LABELS[userData?.role] ?? userData?.role?.toUpperCase() ?? '';
  const memberSince = formatMemberSince(userData?.created_at);
  const isRestaurant = userData?.role === 'restaurant';

  return (
    <div className="page profile-page">
      {/* ── Page heading + saved toast ── */}
      <div className="page-intro">
        <div>
          <span className="eyebrow">ACCOUNT &amp; SETTINGS</span>
          <h1>Make it feel like yours.</h1>
          <p>Manage your profile, restaurant, and preferences.</p>
        </div>
        {saved && (
          <span className="saved-toast">
            <Icon name="check" /> Changes saved
          </span>
        )}
      </div>

      {/* ── Inline error message ── */}
      {error && <p className="profile-error">{error}</p>}

      <div className="profile-grid">
        {/* ── Profile card (aside) ── */}
        <aside className="profile-card">
          {/* Avatar with initials */}
          <div className="large-avatar">
            {initials}
            <button aria-label="Change avatar">
              <Icon name="edit" size={16} />
            </button>
          </div>

          {/* Display name and role */}
          <h2>{userData?.username ?? '—'}</h2>
          <p>{isRestaurant ? `Owner at ${restaurantName || '…'}` : roleBadge}</p>
          <span className="role-badge">{roleBadge}</span>

          {/* Meta details */}
          <div className="profile-details">
            <span>MEMBER SINCE</span>
            <b>{memberSince}</b>
            {isRestaurant && restaurantAddress && (
              <>
                <span>LOCATION</span>
                <b>{restaurantAddress}</b>
              </>
            )}
          </div>
        </aside>

        {/* ── Personal info form ── */}
        <form className="profile-form panel" onSubmit={handlePersonalSubmit}>
          <div className="form-title">
            <div>
              <span className="eyebrow">PERSONAL INFORMATION</span>
              <h2>Your details</h2>
            </div>
            <button className="button primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>

          <div className="fields">
            {/* Username */}
            <label>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </label>

            {/* Email */}
            <label className="wide">
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            {/* Phone number */}
            <label>
              Phone number
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </label>

            {/* Read-only role display */}
            <label>
              Role
              <input readOnly value={roleBadge} />
            </label>
          </div>

          {/* ── Restaurant profile section (restaurant role only) ── */}
          {isRestaurant && (
            <>
              <hr />
              <div className="form-title">
                <div>
                  <span className="eyebrow">RESTAURANT PROFILE</span>
                  <h2>Business details</h2>
                </div>
              </div>
              <div className="fields">
                <label className="wide">
                  Restaurant name
                  <input
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Your restaurant's name"
                  />
                </label>
                <label className="wide">
                  Address
                  <input
                    value={restaurantAddress}
                    onChange={(e) => setRestaurantAddress(e.target.value)}
                    placeholder="Street, City, State"
                  />
                </label>
                <label className="wide">
                  Short description
                  <textarea
                    value={restaurantDesc}
                    onChange={(e) => setRestaurantDesc(e.target.value)}
                    placeholder="A brief description of your restaurant…"
                  />
                </label>
              </div>
              {/* Separate save button for restaurant section */}
              <button
                className="button primary"
                type="button"
                onClick={handleRestaurantSubmit}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save restaurant details'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
