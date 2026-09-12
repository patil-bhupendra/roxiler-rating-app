import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchOwnerDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/owner/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setDashboard(data);
    } catch (error) {
      console.error("Fetch owner dashboard error:", error);
      alert("Unable to fetch owner dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      alert("Please fill all password fields");
      return;
    }

    try {
      setUpdatingPassword(true);

      const response = await fetch("http://localhost:5000/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Update password error:", error);
      alert("Unable to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return <p>Loading owner dashboard...</p>;
  }

  if (!dashboard || !dashboard.store) {
    return (
      <div>
        <h1>Owner Dashboard</h1>
        <p>No store assigned to this owner.</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="owner-header">
        <h1>Owner Dashboard</h1>

        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="owner-store-info">
        <h2>{dashboard.store.name}</h2>

        <p>
          <strong>Average Rating:</strong> {dashboard.averageRating}
        </p>

        <p>
          <strong>Total Ratings:</strong> {dashboard.totalRatings}
        </p>
      </div>

      <div className="owner-password-section">
        <h2>Update Password</h2>

        <form onSubmit={handlePasswordUpdate}>
          <div>
            <label>Current Password</label>

            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={updatingPassword}>
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <h2>Users Who Rated Your Store</h2>

      {dashboard.ratings.length === 0 ? (
        <p>No ratings yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.ratings.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OwnerDashboard;
