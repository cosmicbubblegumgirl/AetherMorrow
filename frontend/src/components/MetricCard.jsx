export default function MetricCard({ icon: Icon, title, value, hint }) {
  return (
    <div className="metric-card glass-panel">
      <div className="metric-icon">
        <Icon size={20} />
      </div>
      <p className="eyebrow">{title}</p>
      <h3>{value}</h3>
      <p className="muted small">{hint}</p>
    </div>
  );
}
