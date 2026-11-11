import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";
import { CATEGORIES, DISHES } from "../data/mockData";
import { IMAGES } from "../assets/images";

// Landing page with hero section and menu grid
export default function Home({ addToCart }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All dishes");

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <span className="sketch-label">SMART QUEUES. CALMER KITCHENS.</span>
          <span className="vertical-caption">食 • QUORDA</span>
          <h1>Every order,<br /><em>right on cue.</em></h1>
          <p>QUORDA scores preparation time, quantity, order position, and kitchen category priority.</p>
          <div className="hero-cta">
            <button className="button primary" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
              See the priority flow <Icon name="arrow" />
            </button>
            <span>10-order windows • live scoring</span>
          </div>
          <div className="scribble">sorted clearly <span>↝</span></div>
          <svg className="food-doodle" viewBox="0 0 190 130" aria-hidden="true">
            <path d="M32 55h115c-3 42-25 61-57 61S37 95 32 55Z" />
            <path d="M43 55c19-12 69-17 95 0M68 47c3-19 28-19 32 0" />
            <path d="M74 40c5 3 12 3 19 0M137 10 81 65M150 16 92 70" />
            <path d="M52 68c9 7 17 9 25 10M121 67c-6 8-14 12-23 13" />
          </svg>
        </div>
        <div className="hero-visual">
          <div className="poster-rings" aria-hidden="true"></div>
          <div className="poster-shape poster-shape-one" aria-hidden="true"></div>
          <div className="poster-shape poster-shape-two" aria-hidden="true"></div>
          <div className="image-frame">
            <img src={IMAGES.food} alt="A table filled with fresh Italian dishes" />
            <span className="photo-credit">PHOTO / BRELYN BASHRUM</span>
          </div>
          <div className="hero-note">
            <span>01</span>
            <p><b>THE SMART QUEUE</b><br />Fast, fair, and built for real kitchen rhythm.</p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section" id="menu">
        <div className="section-heading">
          <div><span className="eyebrow">LIVE MENU INTELLIGENCE</span><h2>What’s moving through the kitchen?</h2></div>
          <button className="text-button">View full menu <Icon name="arrow" /></button>
        </div>
        <div className="category-row">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={category === c ? "active" : ""}>{c}</button>
          ))}
        </div>
        <div className="dish-grid">
          {DISHES.map((dish, i) => (
            <article className="dish-card" key={dish.name}>
              <div className="dish-image">
                <img src={dish.image} alt={dish.name} />
                <span>{dish.tag}</span>
                <button aria-label={`Add ${dish.name}`} onClick={addToCart}><Icon name="plus" /></button>
              </div>
              <div className="dish-info">
                <div><h3>{dish.name}</h3><p>{dish.place} <i></i> {dish.time}</p></div>
                <b>${dish.price}</b>
              </div>
              <span className="card-number">0{i + 1}</span>
            </article>
          ))}
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="manifesto">
        <div className="manifesto-title">
          <span>THE QUORDA METHOD</span>
          <h2>Less guessing.<br />More <em>flow.</em></h2>
          <div className="catalog-mark">QUORDA<br />食卓<br />NO. 01</div>
          <button className="button light" onClick={() => navigate("/auth")} style={{ marginTop: "1.5rem" }}>Join QUORDA <Icon name="arrow" /></button>
        </div>
        <div className="promise-grid">
          <div><b>01</b><Icon name="clock" size={26} /><h3>Weighted scoring</h3><p>Time and quantity lead, with category and order position kept in balance.</p></div>
          <div><b>02</b><Icon name="pin" size={26} /><h3>Fair windows</h3><p>Ten-order groups keep the queue flexible without making order numbers meaningless.</p></div>
          <div><b>03</b><Icon name="check" size={26} /><h3>Parallel prep</h3><p>Related categories reveal which orders the kitchen can prepare together.</p></div>
        </div>
      </section>
    </div>
  );
}