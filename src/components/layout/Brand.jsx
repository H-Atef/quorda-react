import { useNavigate } from "react-router-dom";

// Logo component with optional light mode styling
export default function Brand({ light = false }) {
  const navigate = useNavigate();

  return (
    <button className={`brand ${light ? "brand-light" : ""}`} onClick={() => navigate("/")}>
      <span className="brand-mark"><span></span><span></span><span></span></span>
      <span>QUORDA<span className="brand-dot">.</span></span>
    </button>
  );
}