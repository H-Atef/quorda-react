import { useState } from "react";
import Icon from "../components/common/Icon";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "../data/mockData";
import { IMAGES } from "../assets/images";

// Product management with tabs for menu, categories, and scoring weights
export default function Products() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState("menu");
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [infoOpen, setInfoOpen] = useState(null);
  const [categorySettings, setCategorySettings] = useState(INITIAL_CATEGORIES);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [weights, setWeights] = useState({ preparation: 35, quantity: 30, order: 20, category: 15 });
  
  const weightTotal = Object.values(weights).reduce((total, value) => total + value, 0);
  const toggle = (index) => setProducts(products.map((p, i) => (i === index ? { ...p, active: !p.active } : p)));

  const changeTab = (tab) => { setActiveTab(tab); setInfoOpen(null); setShowForm(false); setShowCategoryForm(false); };

  const tabInfo = {
    menu: "Create dishes with a category, cook time, and price. Cook time and quantity are the strongest inputs in each order’s priority score.",
    categories: "Categories group menu items by kitchen station. A priority of 1 adds no score; priorities 2–5 progressively increase an order’s category contribution.",
    weights: "Weights control how QUORDA calculates scores inside each 10-order window. They must total 100%. Windows and VIP rules remain hard sorting constraints.",
  };

  return (
    <div className="page">
      <div className="page-intro">
        <div><span className="eyebrow">PRODUCT MANAGEMENT</span><h1>Configure the kitchen logic.</h1><p>Manage menu items, category priority, and the weights behind every score.</p></div>
      </div>

      {/* Tabs */}
      <div className="management-tabs" role="tablist">
        {["menu", "categories", "weights"].map((tab, idx) => (
          <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => changeTab(tab)} role="tab">
            <span>0{idx + 1}</span> {tab === "menu" ? "Add menu items" : tab === "categories" ? "Categories" : "Calculation weights"}
          </button>
        ))}
      </div>

      {/* Context & Info */}
      <div className="tab-context">
        <div><span className="eyebrow">CURRENT SECTION</span><h2>{activeTab === "menu" ? "Menu items" : activeTab === "categories" ? "Category priority" : "Scoring weights"}</h2></div>
        <button className={`info-button ${infoOpen === activeTab ? "active" : ""}`} onClick={() => setInfoOpen(infoOpen === activeTab ? null : activeTab)}>
          <Icon name="info" /><span>How this works</span>
        </button>
      </div>
      {infoOpen === activeTab && (
        <div className="info-callout">
          <Icon name="info" /><p>{tabInfo[activeTab]}</p>
          <button onClick={() => setInfoOpen(null)} aria-label="Close information">×</button>
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === "menu" && (
        <>
          <div className="tab-action-row">
            <p>Add a dish or update availability in your current menu.</p>
            <button className="button primary" onClick={() => setShowForm(!showForm)}><Icon name={showForm ? "minus" : "plus"} /> {showForm ? "Close form" : "Add menu item"}</button>
          </div>
          {showForm && (
            <form className="quick-add menu-item-form" onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setProducts([{ name: data.get("name"), category: data.get("category"), price: `$${Number(data.get("price")).toFixed(2)}`, sold: 0, image: IMAGES.salad, active: true }, ...products]);
              e.currentTarget.reset(); setShowForm(false);
            }}>
              <div>
                <label>Item name<input name="name" required placeholder="e.g. Sesame green salad" /></label>
                <label>Category<select name="category">{categorySettings.map((c) => <option key={c.id}>{c.name}</option>)}</select></label>
                <label>Cook time<input name="time" required type="number" min="1" placeholder="Minutes" /></label>
                <label>Price<input name="price" required type="number" min="0" step="0.01" placeholder="$ 0.00" /></label>
              </div>
              <button className="button primary">Save item</button>
            </form>
          )}
          <div className="product-summary">
            <div><span>All dishes</span><b>{products.length}</b></div>
            <div><span>Available</span><b>{products.filter((p) => p.active).length}</b></div>
            <div><span>Sold out</span><b>{products.filter((p) => !p.active).length}</b></div>
            <div className="product-search"><Icon name="search" /><input placeholder="Search your menu" /></div>
          </div>
          <section className="panel product-panel">
            <div className="product-head"><span>Dish</span><span>Category</span><span>Price</span><span>Sold this month</span><span>Availability</span><span></span></div>
            {products.map((product, i) => (
              <div className="product-row" key={`${product.name}-${i}`}>
                <div className="product-name" data-label="Dish"><img src={product.image} alt="" /><div><b>{product.name}</b><small>{product.sold ? "Updated 2 days ago" : "Added just now"}</small></div></div>
                <span data-label="Category">{product.category}</span>
                <b data-label="Price">{product.price}</b>
                <div className="sold-bar" data-label="Sold this month"><i style={{ width: `${product.sold}%` }}></i><span>{product.sold}</span></div>
                <button className={`toggle ${product.active ? "on" : ""}`} onClick={() => toggle(i)} data-label="Availability"><i></i><span>{product.active ? "Available" : "Sold out"}</span></button>
                <button className="edit-button" aria-label="Edit" data-label="Actions"><Icon name="edit" /></button>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <>
          <div className="tab-action-row">
            <p>Set a higher priority for fast or strategically important kitchen categories.</p>
            <button className="button primary" onClick={() => setShowCategoryForm(!showCategoryForm)}><Icon name={showCategoryForm ? "minus" : "plus"} /> {showCategoryForm ? "Close form" : "Add category"}</button>
          </div>
          {showCategoryForm && (
            <form className="quick-add category-add-form" onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setCategorySettings([...categorySettings, { id: Date.now(), name: data.get("name"), station: data.get("station"), priority: Number(data.get("priority")), items: 0 }]);
              e.currentTarget.reset(); setShowCategoryForm(false);
            }}>
              <div>
                <label>Category name<input name="name" required placeholder="e.g. Pickles" /></label>
                <label>Kitchen station<input name="station" required placeholder="e.g. Cold station" /></label>
                <label>Priority<select name="priority" defaultValue="1">{[1, 2, 3, 4, 5].map((p) => <option key={p}>{p}</option>)}</select></label>
              </div>
              <button className="button primary">Save category</button>
            </form>
          )}
          <section className="panel category-panel">
            <div className="category-head"><span>Category</span><span>Station</span><span>Menu items</span><span>Priority score</span><span></span></div>
            {categorySettings.map((category, index) => (
              <div className="category-manage-row" key={category.id}>
                <div className="cat-main"><span className="category-index">0{index + 1}</span><b>{category.name}</b></div>
                <div className="cat-meta"><span>Station</span><span>{category.station}</span><span>Items</span><span>{category.items} items</span></div>
                <div className="cat-meta"><span>Priority score</span><div className="priority-control">
                  <select value={category.priority} onChange={(e) => setCategorySettings(categorySettings.map((item) => item.id === category.id ? { ...item, priority: Number(e.target.value) } : item))}>
                    {[1, 2, 3, 4, 5].map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <div className="priority-dots">{[1, 2, 3, 4, 5].map((dot) => <i key={dot} className={dot <= category.priority ? "filled" : ""}></i>)}</div>
                </div></div>
                <div className="cat-meta"><span>Actions</span><button className="edit-button"><Icon name="edit" /></button></div>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Weights Tab */}
      {activeTab === "weights" && (
        <section className="weights-layout">
          <div className="panel weights-panel">
            {[
              ["preparation", "Preparation time", "Shorter total cook time receives a higher score."],
              ["quantity", "Order quantity", "Fewer total items receives a higher score."],
              ["order", "Order position", "Earlier IDs rank higher inside their 10-order window."],
              ["category", "Category priority", "Categories rated 2–5 add a progressive score bonus."],
            ].map(([key, label, description], index) => (
              <div className="weight-row" key={key}>
                <span className="weight-number">0{index + 1}</span>
                <div className="weight-copy"><b>{label}</b><p>{description}</p></div>
                <input type="range" min="0" max="60" value={weights[key]} onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })} />
                <output>{weights[key]}%</output>
              </div>
            ))}
          </div>
          <aside className="weight-summary">
            <span className="eyebrow">WEIGHT TOTAL</span>
            <strong className={weightTotal === 100 ? "valid" : "invalid"}>{weightTotal}%</strong>
            <p>{weightTotal === 100 ? "Ready to save. All scoring influence has been allocated." : `Adjust the sliders by ${Math.abs(100 - weightTotal)}% so the total equals 100%.`}</p>
            <div className="weight-stack">
              <i style={{ flex: weights.preparation }}></i><i style={{ flex: weights.quantity }}></i><i style={{ flex: weights.order }}></i><i style={{ flex: weights.category }}></i>
            </div>
            <button className="button primary" disabled={weightTotal !== 100} onClick={() => { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2500); }}>
              {settingsSaved ? <Icon name="check" /> : null}{settingsSaved ? "Weights saved" : "Save weights"}
            </button>
            <button className="reset-weights" onClick={() => setWeights({ preparation: 35, quantity: 30, order: 20, category: 15 })}>Reset to recommended</button>
          </aside>
        </section>
      )}
    </div>
  );
}