import { useEffect, useState } from "react";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchStores = async (name = nameSearch, address = addressSearch) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (name.trim()) {
        queryParams.append("name", name.trim());
      }

      if (address.trim()) {
        queryParams.append("address", address.trim());
      }

      const response = await fetch(
        `http://localhost:5000/api/stores?${queryParams.toString()}`,
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
    fetchStores("", "");
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

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      alert("Please enter current and new password");
      return;
    }

    try {
      setPasswordLoading(true);

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
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <h1>User Dashboard</h1>

      <div className="password-section">
        <h2>Update Password</h2>

        <form onSubmit={updatePassword}>
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

          <button type="submit" disabled={passwordLoading}>
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by store name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by address"
          value={addressSearch}
          onChange={(e) => setAddressSearch(e.target.value)}
        />

        <button onClick={() => fetchStores()}>Search</button>

        <button
          onClick={() => {
            setNameSearch("");
            setAddressSearch("");
            fetchStores("", "");
          }}
        >
          Clear
        </button>
      </div>

      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div>
          {stores.map((store) => (
            <div key={store.id} className="store-card">
              <h2>{store.name}</h2>

              <p>
                <strong>Address:</strong> {store.address}
              </p>

              <p>
                <strong>Overall Rating:</strong> {store.overallRating}
              </p>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
