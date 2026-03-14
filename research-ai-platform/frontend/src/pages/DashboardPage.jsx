import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Overview of your uploaded research papers and recent activity.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-icon">📄</span>
          <div>
            <h3>Papers Uploaded</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🧠</span>
          <div>
            <h3>Summaries Generated</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💬</span>
          <div>
            <h3>Questions Answered</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔗</span>
          <div>
            <h3>Citations Explored</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
      </div>

      <div className="papers-section">
        <h2>Recent Papers</h2>
        <div className="empty-state">
          <p>No papers uploaded yet. Head to the <a href="/upload">Upload page</a> to get started.</p>
        </div>
      </div>
    </div>
  );
}
