import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setStats({
        totalUsers: data.totalUsers,
        totalStores: data.totalStores,
        totalRatings: data.totalRatings,
      });
    } catch (error) {
      console.error(
        "Fetch dashboard stats error:",
        error
      );

      alert("Unable to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="stats-container">
          <div className="stat-card">
            <h2>Total Users</h2>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="stat-card">
            <h2>Total Stores</h2>
            <p>{stats.totalStores}</p>
          </div>

          <div className="stat-card">
            <h2>Total Ratings</h2>
            <p>{stats.totalRatings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;