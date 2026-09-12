import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminUserDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
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

      setUser(data.user);
    } catch (error) {
      console.error("Fetch user details error:", error);
      alert("Unable to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (!user) {
    return <p>User details not found.</p>;
  }

  return (
    <div>
      <h1>User Details</h1>

      <div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Address:</strong> {user.address}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      {user.role === "OWNER" && user.store && (
        <div>
          <h2>Store Details</h2>

          <p>
            <strong>Store Name:</strong> {user.store.name}
          </p>

          <p>
            <strong>Store Email:</strong> {user.store.email}
          </p>

          <p>
            <strong>Store Address:</strong> {user.store.address}
          </p>

          <p>
            <strong>Average Rating:</strong>{" "}
            {user.store.averageRating}
          </p>

          <p>
            <strong>Total Ratings:</strong>{" "}
            {user.store.totalRatings}
          </p>
        </div>
      )}

      <button onClick={() => navigate("/admin/users")}>
        Back to Users
      </button>
    </div>
  );
};

export default AdminUserDetails;