import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAddStore = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !address) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/stores",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            address,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Store created successfully");

      setName("");
      setEmail("");
      setAddress("");

      navigate("/admin/stores");
    } catch (error) {
      console.error("Create store error:", error);
      alert("Unable to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Store</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Store Name</label>

          <input
            type="text"
            placeholder="Enter store name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter store email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Address</label>

          <textarea
            placeholder="Enter store address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Store"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/stores")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AdminAddStore;