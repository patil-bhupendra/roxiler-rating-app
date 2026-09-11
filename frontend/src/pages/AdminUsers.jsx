import { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("ASC");

  const token = localStorage.getItem("token");

  const fetchUsers = async (
    name = nameSearch,
    email = emailSearch,
    address = addressSearch,
    role = roleFilter,
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

      if (role) {
        queryParams.append("role", role);
      }
      queryParams.append("sortBy", sort);
      queryParams.append("order", sortOrder);

      const response = await fetch(
        `http://localhost:5000/api/admin/users?${queryParams.toString()}`,
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

      setUsers(data.users);
    } catch (error) {
      console.error("Fetch users error:", error);
      alert("Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers("", "", "", "");
  }, []);

  const clearFilters = () => {
    setNameSearch("");
    setEmailSearch("");
    setAddressSearch("");
    setRoleFilter("");

    setSortBy("id");
    setOrder("ASC");

    fetchUsers("", "", "", "", "id", "ASC");
  };

  return (
    <div>
      <h1>Admin Users</h1>

      <div className="admin-user-filters">
        <input
          type="text"
          placeholder="Search by name"
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

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
          <option value="OWNER">OWNER</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="address">Sort by Address</option>
          <option value="role">Sort by Role</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>

        <button onClick={() => fetchUsers()}>Search</button>

        <button onClick={clearFilters}>Clear</button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
