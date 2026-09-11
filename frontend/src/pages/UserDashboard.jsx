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

  const submitRating = async (storeId, rating) => {
    try {
      const response = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId,
          rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Rating submitted successfully");

      fetchStores();
    } catch (error) {
      console.error("Submit rating error:", error);
      alert("Unable to submit rating");
    }
  };

  const updateRating = async (storeId, rating) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/ratings/${storeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Rating updated successfully");

      fetchStores();
    } catch (error) {
      console.error("Update rating error:", error);
      alert("Unable to update rating");
    }
  };

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
            <div className="rating-section">
              <p>
                <strong>My Rating:</strong> {store.userRating ?? "Not rated"}
              </p>

              <p>
                <strong>
                  {store.userRating === null
                    ? "Rate this store:"
                    : "Change your rating:"}
                </strong>
              </p>

              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={
                      store.userRating === rating
                        ? "rating-button selected"
                        : "rating-button"
                    }
                    onClick={() => {
                      if (store.userRating === null) {
                        submitRating(store.id, rating);
                      } else {
                        updateRating(store.id, rating);
                      }
                    }}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
