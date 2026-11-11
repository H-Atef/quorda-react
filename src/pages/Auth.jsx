import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";
import Brand from "../components/layout/Brand";
import { IMAGES } from "../assets/images";

// Authentication page (Login / Signup)
export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("Customer");

  const submit = (e) => {
    e.preventDefault();
    navigate(role === "Customer" ? "/" : "/dashboard");
  };

  return (
    <div className="auth-page">
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
      <div className="auth-form-wrap">
        <button className="back-link" onClick={() => navigate("/")}>← Back to discover</button>
        <div className="auth-form">
          <span className="eyebrow">{mode === "login" ? "WELCOME BACK" : "BECOME PART OF QUORDA"}</span>
          <h2>{mode === "login" ? "Sign in to your account." : "Create your account."}</h2>
          <p>{mode === "login" ? "New around here?" : "Already have an account?"} <button onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Create an account" : "Sign in"}</button></p>
          <div className="role-select">
            <span>I am a</span>
            <div>
              {["Customer", "Restaurant owner", "Cashier"].map((r) => (
                <button key={r} className={role === r ? "active" : ""} onClick={() => setRole(r)}>{r}</button>
              ))}
            </div>
          </div>
          <form onSubmit={submit}>
            {mode === "signup" && <label>Full name<input required placeholder="Your full name" /></label>}
            <label>Email address<input required type="email" placeholder="you@example.com" /></label>
            <label>Password<div className="password-input"><input required type="password" placeholder="At least 8 characters" /><span>SHOW</span></div></label>
            {mode === "login" && (
              <div className="auth-options">
                <label><input type="checkbox" /> Remember me</label>
                <button type="button">Forgot password?</button>
              </div>
            )}
            <button className="button primary auth-submit">{mode === "login" ? "Sign in" : "Create account"} <Icon name="arrow" /></button>
          </form>
          <div className="auth-trust">
            <Icon name="check" /><span>Secure access</span>
            <Icon name="check" /><span>Role-based workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}