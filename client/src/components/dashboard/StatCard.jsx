
function StatCard({ title, value, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-card-content">
        <p className="stat-card-label">{title}</p>
        <h2 className="stat-card-value">{value}</h2>
      </div>

      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>
    </article>
  );
}

export default StatCard;