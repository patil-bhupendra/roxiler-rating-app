import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            User Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20 sm:w-auto"
          >
            Logout
          </button>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Update Password
          </h2>

          <form
            onSubmit={updatePassword}
            className="grid grid-cols-1 gap-5 md:grid-cols-3 md:items-end"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Current Password
              </label>

              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-slate-900/20"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Search Stores</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto_auto]">
            <input
              type="text"
              placeholder="Search by store name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            />

            <input
              type="text"
              placeholder="Search by address"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            />

            <button
              onClick={() => fetchStores()}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20"
            >
              Search
            </button>

            <button
              onClick={() => {
                setNameSearch("");
                setAddressSearch("");
                fetchStores("", "");
              }}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
            >
              Clear
            </button>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Stores</h2>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Loading stores...
              </p>
            </div>
          ) : stores.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                No stores found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7"
                >
                  <h2 className="mb-5 text-xl font-bold text-slate-900">
                    {store.name}
                  </h2>

                  <div className="space-y-3 border-b border-slate-100 pb-5">
                    <p className="text-sm text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        Address:
                      </strong>{" "}
                      {store.address}
                    </p>

                    <p className="text-sm text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        Overall Rating:
                      </strong>{" "}
                      {store.overallRating}
                    </p>
                  </div>

                  <div className="pt-5">
                    <p className="mb-4 text-sm text-slate-600">
                      <strong className="font-semibold text-slate-800">
                        My Rating:
                      </strong>{" "}
                      {store.userRating ?? "Not rated"}
                    </p>

                    <p className="mb-3 text-sm font-semibold text-slate-800">
                      {store.userRating === null
                        ? "Rate this store:"
                        : "Change your rating:"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className={
                            store.userRating === rating
                              ? "h-10 w-10 rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20"
                              : "h-10 w-10 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
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
        </section>
      </div>
    </main>
  );
};

export default UserDashboard;
