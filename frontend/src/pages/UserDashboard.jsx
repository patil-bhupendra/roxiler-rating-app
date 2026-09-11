import { useEffect, useState } from "react";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchStores = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/stores?name=${search}`,
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

      setStores(data.stores);
    } catch (error) {
      console.error("Fetch stores error:", error);
      alert("Unable to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>

      <div>
        <input
          type="text"
          placeholder="Search store by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={fetchStores}>Search</button>
      </div>

      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div>
          {stores.map((store) => (
            <div key={store.id}>
              <h2>{store.name}</h2>

              <p>
                <strong>Address:</strong> {store.address}
              </p>

              <p>
                <strong>Overall Rating:</strong> {store.overallRating}
              </p>

              <p>
                <strong>My Rating:</strong> {store.userRating ?? "Not rated"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
