import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../data/mockData";
import Icon from "../common/Icon";
import Brand from "./Brand";

// Sidebar navigation with collapse functionality
export default function Sidebar({ mobileOpen, sidebarCollapsed, setSidebarCollapsed, setMobileOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activePath = pathname === "/" ? "home" : pathname.replace("/", "");

  // The chevron toggle extends/collapses the menu. On desktop it collapses
  // the sidebar; on mobile it opens/closes the drawer.
  const toggleMenu = () => {
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <Brand />
      <button className="sidebar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        <Icon name="chevron" size={16} />
      </button>
      <nav>
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className={activePath === item.id ? "active" : ""} onClick={() => navigate(item.id === "home" ? "/" : `/${item.id}`)}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="mini-profile">
          <div className="avatar">AK</div>
          <div><b>Amara K.</b><span>Restaurant owner</span></div>
        </div>
        <button className="icon-only" onClick={() => navigate("/auth")} aria-label="Log out">
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  );
}