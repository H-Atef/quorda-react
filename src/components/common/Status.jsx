// Renders a colored status badge for orders
export default function Status({ value }) {
  const className = `status ${value.toLowerCase().replace(" ", "-")}`;
  return (
    <span className={className}>
      <i></i>
      {value}
    </span>
  );
}