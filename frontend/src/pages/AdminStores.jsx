import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("ASC");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchStores = async (
    name = nameSearch,
    email = emailSearch,
    address = addressSearch,
    sort = sortBy,
    sortOrder = order,
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

      queryParams.append("sortBy", sort);
      queryParams.append("order", sortOrder);

      const response = await fetch(
        `http://localhost:5000/api/admin/stores?${queryParams.toString()}`,
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
    fetchStores("", "", "", "id", "ASC");
  }, []);

  const clearFilters = () => {
    setNameSearch("");
    setEmailSearch("");
    setAddressSearch("");

    setSortBy("id");
    setOrder("ASC");

    fetchStores("", "", "", "id", "ASC");
  };

  return (
    <div>
      <div className="admin-stores-header">
        <h1>Admin Stores</h1>

        <button onClick={() => navigate("/admin/stores/add")}>Add Store</button>
      </div>

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

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="address">Sort by Address</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>

        <button onClick={() => fetchStores()}>Search</button>

        <button onClick={clearFilters}>Clear</button>
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
