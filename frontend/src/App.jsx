import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminAddUser from "./pages/AdminAddUser";
import AdminAddStore from "./pages/AdminAddStore";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/stores" element={<AdminStores />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/admin/users/:id" element={<AdminUserDetails />} />
        <Route path="/admin/users/add" element={<AdminAddUser />} />
        <Route path="/admin/stores/add" element={<AdminAddStore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
