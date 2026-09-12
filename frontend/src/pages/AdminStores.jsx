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
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Stores
          </h1>

          <button
            onClick={() => navigate("/admin/stores/add")}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20 sm:w-auto"
          >
            Add Store
          </button>
        </div>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <input
              type="text"
              placeholder="Search by store name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            />

            <input
              type="text"
              placeholder="Search by email"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            />

            <input
              type="text"
              placeholder="Search by address"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
              <option value="address">Sort by Address</option>
            </select>

            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => fetchStores()}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-900/20"
            >
              Search
            </button>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
            >
              Clear
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                Loading stores...
              </p>
            </div>
          ) : stores.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                No stores found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Name
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Address
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Rating
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Owner
                    </th>

                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Assign Owner
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {stores.map((store) => (
                    <tr key={store.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {store.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {store.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {store.address}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {store.overallRating}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {store.owner ? (
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {store.owner.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {store.owner.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-slate-400">
                            Not Assigned
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex min-w-[220px] flex-col gap-2">
                          <select
                            value={ownerIds[store.id] || ""}
                            onChange={(e) =>
                              setOwnerIds((prev) => ({
                                ...prev,
                                [store.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
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
                              !ownerIds[store.id] ||
                              assigningStoreId === store.id
                            }
                            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {assigningStoreId === store.id
                              ? "Assigning..."
                              : "Assign Owner"}
                          </button>
                        </div>
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

export default AdminStores;
