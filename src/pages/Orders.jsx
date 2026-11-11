import { useState } from "react";
import Icon from "../components/common/Icon";
import OrderTable from "../components/common/OrderTable";
import { RECENT_ORDERS } from "../data/mockData";

// Order management page with filtering tabs
export default function Orders() {
  const [filter, setFilter] = useState("All orders");
  const allOrders = [
    ...RECENT_ORDERS,
    { id: "#QU-2494", customer: "Sofia Rose", initials: "SR", items: "2 items", total: "$34.60", status: "Cancelled", time: "11:41 AM" },
    { id: "#QU-2493", customer: "Eli Thomas", initials: "ET", items: "3 items", total: "$57.20", status: "Delivered", time: "11:22 AM" },
  ];
  
  const filtered = filter === "All orders" ? allOrders : allOrders.filter((o) => o.status === filter);

  return (
    <div className="page">
      <div className="page-intro">
        <div><span className="eyebrow">ORDER MANAGEMENT</span><h1>Keep every order moving.</h1><p>Track, prepare, and complete orders from one place.</p></div>
        <button className="button outline"><Icon name="filter" /> Filter</button>
      </div>
      <div className="order-tabs">
        {["All orders", "Preparing", "Ready", "Delivered", "Cancelled"].map((tab) => (
          <button className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)} key={tab}>
            {tab}<span>{tab === "All orders" ? allOrders.length : allOrders.filter((o) => o.status === tab).length}</span>
          </button>
        ))}
      </div>
      <section className="panel full-panel">
        <div className="panel-heading">
          <div><h2>{filter}</h2><span className="subtle">Live updates enabled</span></div>
          <div className="date-picker"><Icon name="clock" /> Today, May 20</div>
        </div>
        <OrderTable orders={filtered} />
      </section>
    </div>
  );
}