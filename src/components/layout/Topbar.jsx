import { useNavigate } from "react-router-dom";
import Icon from "../common/Icon";

// Top header with title, search, and cart actions
export default function Topbar({ mobileOpen, setMobileOpen, cart }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        <span></span><span></span>
      </button>
      <div className="topbar-title">
        <span className="eyebrow">QUORDA</span>
        <h2>Good afternoon, Amara.</h2>
      </div>
      <div className="topbar-actions">
        <button className="search-button" onClick={() => navigate("/")}>
          <Icon name="search" /><span>Search anything</span><kbd>⌘ K</kbd>
        </button>
        <button className="round-button" aria-label="Notifications"><Icon name="bell" /><i></i></button>
        <button className="cart-button" onClick={() => navigate("/orders")}>
          <Icon name="bag" /><span>{cart}</span>
        </button>
      </div>
    </header>
  );
}