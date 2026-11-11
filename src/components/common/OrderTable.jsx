import Icon from "./Icon";
import Status from "./Status";

// Reusable table component for displaying order lists
export default function OrderTable({ orders }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th><th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td><b>{order.id}</b></td>
              <td><div className="customer"><span>{order.initials}</span>{order.customer}</div></td>
              <td>{order.items}</td>
              <td><b>{order.total}</b></td>
              <td><Status value={order.status} /></td>
              <td>{order.time}</td>
              <td><button aria-label="Order details"><Icon name="chevron" size={17} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}