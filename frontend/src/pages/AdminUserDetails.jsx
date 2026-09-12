import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminUserDetails = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
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

      setUser(data.user);
    } catch (error) {
      console.error("Fetch user details error:", error);
      alert("Unable to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Loading user details...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            User details not found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            User Details
          </h1>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Name
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Email
              </p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Address
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {user.address}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Role
              </p>

              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {user.role}
              </span>
            </div>
          </div>
        </section>

        {user.role === "OWNER" && user.store && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Store Details
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Store Name
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user.store.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Store Email
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                  {user.store.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Store Address
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user.store.address}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Average Rating
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user.store.averageRating}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Total Ratings
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user.store.totalRatings}
                </p>
              </div>
            </div>
          </section>
        )}

        <button
          onClick={() => navigate("/admin/users")}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20"
        >
          Back to Users
        </button>
      </div>
    </main>
  );
};

export default AdminUserDetails;
