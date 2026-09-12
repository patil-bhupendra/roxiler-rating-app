import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("ASC");

  const [ownerIds, setOwnerIds] = useState({});
  const [assigningStoreId, setAssigningStoreId] = useState(null);

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

  const fetchOwners = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/users?role=OWNER&sortBy=name&order=ASC",
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

      setOwners(data.users);
    } catch (error) {
      console.error("Fetch owners error:", error);
      alert("Unable to fetch owners");
    }
  };

  useEffect(() => {
    fetchStores("", "", "", "id", "ASC");
    fetchOwners();
  }, []);

  const clearFilters = () => {
    setNameSearch("");
    setEmailSearch("");
    setAddressSearch("");

    setSortBy("id");
    setOrder("ASC");

    fetchStores("", "", "", "id", "ASC");
  };

  const assignOwner = async (storeId) => {
    const ownerId = ownerIds[storeId];

    if (!ownerId) {
      alert("Please enter owner ID");
      return;
    }

    try {
      setAssigningStoreId(storeId);

      const response = await fetch(
        `http://localhost:5000/api/admin/stores/${storeId}/owner`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ownerId: Number(ownerId),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Store owner assigned successfully");

      setOwnerIds((prev) => ({
        ...prev,
        [storeId]: "",
      }));

      fetchStores();
    } catch (error) {
      console.error("Assign owner error:", error);
      alert("Unable to assign store owner");
    } finally {
      setAssigningStoreId(null);
    }
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
              <th>Owner</th>
              <th>Assign Owner</th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>

                <td>{store.email}</td>

                <td>{store.address}</td>

                <td>{store.overallRating}</td>

                <td>
                  {store.owner ? (
                    <div>
                      <strong>{store.owner.name}</strong>
                      <br />
                      <small>{store.owner.email}</small>
                    </div>
                  ) : (
                    "Not Assigned"
                  )}
                </td>

                <td>
                  <select
                    value={ownerIds[store.id] || ""}
                    onChange={(e) =>
                      setOwnerIds((prev) => ({
                        ...prev,
                        [store.id]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Owner</option>

                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => assignOwner(store.id)}
                    disabled={
                      !ownerIds[store.id] || assigningStoreId === store.id
                    }
                  >
                    {assigningStoreId === store.id
                      ? "Assigning..."
                      : "Assign Owner"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminStores;
