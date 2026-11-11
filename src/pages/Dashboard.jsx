import { useNavigate } from "react-router-dom";
import Icon from "../components/common/Icon";
import OrderTable from "../components/common/OrderTable";
import { DISHES, RECENT_ORDERS } from "../data/mockData";

// Analytics dashboard with stats, charts, and recent orders
export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page dashboard-page">
      <div className="page-intro">
        <div><span className="eyebrow">TUESDAY, MAY 20</span><h1>Here’s how the kitchen is doing.</h1></div>
        <button className="button primary" onClick={() => navigate("/products")}><Icon name="plus" /> Add new dish</button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat dark"><span>Today’s revenue</span><strong>$1,842<span>.50</span></strong><p><b>↑ 12.4%</b> from last Tuesday</p><div className="mini-line"></div></div>
        <div className="stat"><span>Orders today</span><strong>48</strong><p><b>↑ 8.2%</b> from last Tuesday</p><div className="bar-cluster"><i></i><i></i><i></i><i></i><i></i></div></div>
        <div className="stat"><span>Average order</span><strong>$38<span>.40</span></strong><p><b>↑ 3.1%</b> this week</p><div className="circle-stat">68%</div></div>
        <div className="stat"><span>Active dishes</span><strong>24</strong><p><b>3</b> currently sold out</p><button onClick={() => navigate("/products")}>Manage menu <Icon name="arrow" /></button></div>
      </div>

      {/* Charts & Popular */}
      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-heading"><div><span className="eyebrow">WEEKLY OVERVIEW</span><h2>Revenue</h2></div><select aria-label="Date range"><option>Last 7 days</option><option>Last month</option></select></div>
          <div className="chart">
            <div className="y-labels"><span>$2k</span><span>$1.5k</span><span>$1k</span><span>$500</span><span>$0</span></div>
            <div className="chart-area">
              <div className="grid-lines"><i></i><i></i><i></i><i></i></div>
              <svg viewBox="0 0 600 190" preserveAspectRatio="none">
                <path className="area" d="M0 156 C55 145,70 92,125 105 S210 145,255 83 S345 55,390 88 S465 127,510 65 S570 42,600 20 L600 190 L0 190Z" />
                <path className="line" d="M0 156 C55 145,70 92,125 105 S210 145,255 83 S345 55,390 88 S465 127,510 65 S570 42,600 20" />
              </svg>
              <div className="x-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
            </div>
          </div>
        </section>
        <section className="panel popular-panel">
          <div className="panel-heading"><div><span className="eyebrow">TOP SELLERS</span><h2>Popular today</h2></div><button><Icon name="more" /></button></div>
          {DISHES.map((dish, i) => (
            <div className="popular-row" key={dish.name}>
              <span>0{i + 1}</span><img src={dish.image} alt="" />
              <div><b>{dish.name}</b><small>{12 - i * 2} orders</small></div>
              <strong>${(216 - i * 25).toFixed(2)}</strong>
            </div>
          ))}
        </section>
      </div>

      {/* Recent Orders */}
      <section className="panel orders-panel">
        <div className="panel-heading">
          <div><span className="eyebrow">LIVE FEED</span><h2>Recent orders</h2></div>
          <button className="text-button" onClick={() => navigate("/orders")}>View all orders <Icon name="arrow" /></button>
        </div>
        <OrderTable orders={RECENT_ORDERS} />
      </section>
    </div>
  );
}