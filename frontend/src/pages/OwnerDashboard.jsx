import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchOwnerDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/owner/dashboard",
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

      setDashboard(data);
    } catch (error) {
      console.error("Fetch owner dashboard error:", error);
      alert("Unable to fetch owner dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      alert("Please fill all password fields");
      return;
    }

    try {
      setUpdatingPassword(true);

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
      setUpdatingPassword(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Loading owner dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!dashboard || !dashboard.store) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Owner Dashboard
            </h1>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20 sm:w-auto"
            >
              Logout
            </button>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              No store assigned to this owner.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Owner Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20 sm:w-auto"
          >
            Logout
          </button>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            {dashboard.store.name}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Average Rating
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {dashboard.averageRating}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Ratings
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {dashboard.totalRatings}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Update Password
          </h2>

          <form
            onSubmit={handlePasswordUpdate}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="currentPassword"
                className="text-sm font-semibold text-slate-700"
              >
                Current Password
              </label>

              <input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="newPassword"
                className="text-sm font-semibold text-slate-700"
              >
                New Password
              </label>

              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-bold text-slate-900">
              Users Who Rated Your Store
            </h2>
          </div>

          {dashboard.ratings.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                No ratings yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      User Name
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Rating
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {dashboard.ratings.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {item.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {item.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default OwnerDashboard;
