import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !address) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          address,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("User created successfully");

      setName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setRole("USER");

      navigate("/admin/users");
    } catch (error) {
      console.error("Create user error:", error);
      alert("Unable to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Add User
          </h1>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="text-sm font-semibold text-slate-700"
              >
                Address
              </label>

              <textarea
                id="address"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="4"
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="role"
                className="text-sm font-semibold text-slate-700"
              >
                Role
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OWNER">OWNER</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create User"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminAddUser;
