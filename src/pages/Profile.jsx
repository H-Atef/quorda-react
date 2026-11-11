import { useState } from "react";
import Icon from "../components/common/Icon";

// User profile and restaurant settings page
export default function Profile() {
  const [saved, setSaved] = useState(false);
  const submit = (e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="page profile-page">
      <div className="page-intro">
        <div><span className="eyebrow">ACCOUNT & SETTINGS</span><h1>Make it feel like yours.</h1><p>Manage your profile, restaurant, and preferences.</p></div>
        {saved && <span className="saved-toast"><Icon name="check" /> Changes saved</span>}
      </div>
      <div className="profile-grid">
        <aside className="profile-card">
          <div className="large-avatar">AK<button><Icon name="edit" size={16} /></button></div>
          <h2>Amara King</h2><p>Owner at Wild & Rooted</p>
          <span className="role-badge">RESTAURANT OWNER</span>
          <div className="profile-details">
            <span>MEMBER SINCE</span><b>September 2023</b>
            <span>LOCATION</span><b>Portland, Oregon</b>
          </div>
        </aside>
        <form className="profile-form panel" onSubmit={submit}>
          <div className="form-title">
            <div><span className="eyebrow">PERSONAL INFORMATION</span><h2>Your details</h2></div>
            <button className="button primary">Save changes</button>
          </div>
          <div className="fields">
            <label>First name<input defaultValue="Amara" /></label>
            <label>Last name<input defaultValue="King" /></label>
            <label className="wide">Email address<input type="email" defaultValue="amara@wildandrooted.com" /></label>
            <label>Phone number<input defaultValue="+1 503 555 0182" /></label>
            <label>Role<select defaultValue="Restaurant owner"><option>Restaurant owner</option><option>Cashier</option><option>Customer</option></select></label>
          </div>
          <hr />
          <div className="form-title"><div><span className="eyebrow">RESTAURANT PROFILE</span><h2>Business details</h2></div></div>
          <div className="fields">
            <label className="wide">Restaurant name<input defaultValue="Wild & Rooted" /></label>
            <label>City<input defaultValue="Portland" /></label>
            <label>Postal code<input defaultValue="97205" /></label>
            <label className="wide">Short description<textarea defaultValue="Vegetable-forward comfort food made with produce from local growers." /></label>
          </div>
        </form>
      </div>
    </div>
  );
}