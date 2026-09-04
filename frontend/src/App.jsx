import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [health, setHealth] = useState(null);
  const [version, setVersion] = useState(null);
  const [deployments, setDeployments] = useState([]);

  const checkHealth = () => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => setHealth(data))
      .catch(() => {
        setHealth({
          status: "failed",
          database: "disconnected",
        });
      });
  };

  const getVersion = () => {
    fetch("http://localhost:5000/api/version")
      .then((response) => response.json())
      .then((data) => setVersion(data));
  };

  const getDeployments = () => {
    fetch("http://localhost:5000/api/deployments")
      .then((response) => response.json())
      .then((data) => setDeployments(data));
  };

  useEffect(() => {
    checkHealth();
    getVersion();
    getDeployments();
  }, []);

  return (
    <div className="dashboard">

      <h1>🚀 AutoHeal Dashboard</h1>

      <p className="subtitle">
        DevOps Application Health Monitor
      </p>

      <div className="cards">

        <div className="card">
          <h2>Application</h2>

          <p>
            {health?.status === "healthy"
              ? "🟢 Healthy"
              : "🔴 Failed"}
          </p>
        </div>

        <div className="card">
          <h2>Database</h2>

          <p>
            {health?.database === "connected"
              ? "🟢 Connected"
              : "🔴 Disconnected"}
          </p>
        </div>

        <div className="card">
          <h2>Version</h2>

          <p>
            {version ? version.version : "Loading..."}
          </p>
        </div>

      </div>

      <div className="pipeline">

        <h2>CI/CD Pipeline</h2>

        <p>
          GitHub → Jenkins → Docker → Artifactory
          → Terraform → Azure → Ansible
        </p>

      </div>

      <div className="deployments">

        <h2>Recent Deployments</h2>

        {deployments.length === 0 ? (
          <p>No deployments found.</p>
        ) : (
          deployments.map((deployment) => (
            <div className="deployment" key={deployment._id}>

              <span>
                Version: {deployment.version}
              </span>

              <span>
                Environment: {deployment.environment}
              </span>

              <span>
                Status: {deployment.status}
              </span>

            </div>
          ))
        )}

      </div>

      <button onClick={() => {
        checkHealth();
        getVersion();
        getDeployments();
      }}>
        🔄 Refresh Status
      </button>

    </div>
  );
}

export default App;