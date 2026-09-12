import { useEffect, useState } from "react";

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchStores = async (
    name = nameSearch,
    email = emailSearch,
    address = addressSearch
  ) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams();

      if (name.trim()) {
        queryParams.append("name", name.trim());
      }

      if (email.trim()) {
        queryParams.append("email", email.trim());
      }

      if (address.trim()) {
        queryParams.append("address", address.trim());
      }

      const response = await fetch(
        `http://localhost:5000/api/admin/stores?${queryParams.toString()}`,
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

      setStores(data.stores);
    } catch (error) {
      console.error("Fetch stores error:", error);
      alert("Unable to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores("", "", "");
  }, []);

  const clearFilters = () => {
    setNameSearch("");
    setEmailSearch("");
    setAddressSearch("");

    fetchStores("", "", "");
  };

  return (
    <div>
      <h1>Admin Stores</h1>

      
      <div className="admin-store-filters">
        <input
          type="text"
          placeholder="Search by store name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by email"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by address"
          value={addressSearch}
          onChange={(e) => setAddressSearch(e.target.value)}
        />

        <button onClick={() => fetchStores()}>
          Search
        </button>

        <button onClick={clearFilters}>
          Clear
        </button>
      </div>

      
      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.overallRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminStores;