import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameError = name.length > 0 && (name.length < 20 || name.length > 60);

  const emailError = email.length > 0 && !emailRegex.test(email);

  const passwordError = password.length > 0 && !passwordRegex.test(password);

  const confirmPasswordError =
    confirmPassword.length > 0 && confirmPassword !== password;

  const addressError = address.length > 400;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (name.length < 20 || name.length > 60) {
      alert("Name must be between 20 and 60 characters");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be 8-16 characters and contain at least one uppercase letter and one special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (address.length > 400) {
      alert("Address cannot exceed 400 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Registration successful. Please login.");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="bg-slate-900 px-8 py-8 text-white">
          <h1 className="text-2xl font-bold tracking-tight">
            Roxiler Rating APP
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Create your account to get started.
          </p>
        </div>

        <div className="px-8 py-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">
              Create Account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Register as a user to rate and review stores.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={20}
                maxLength={60}
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
                  nameError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
              />

              {nameError && (
                <p className="text-xs font-medium text-red-600">
                  Name must be between 20 and 60 characters.
                </p>
              )}

              <p className="text-right text-xs text-slate-400">
                {name.length}/60
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
                  emailError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
              />

              {emailError && (
                <p className="text-xs font-medium text-red-600">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            {/* Password */}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={16}
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
                  passwordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
              />

              {passwordError && (
                <p className="text-xs font-medium leading-5 text-red-600">
                  Password must be 8–16 characters and contain at least one
                  uppercase letter and one special character.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-slate-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
                  confirmPasswordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
              />

              {confirmPasswordError && (
                <p className="text-xs font-medium text-red-600">
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address"
                className="text-sm font-semibold text-slate-700"
              >
                Address
              </label>

              <textarea
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={400}
                required
                rows="3"
                className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
                  addressError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
              />

              {addressError && (
                <p className="text-xs font-medium text-red-600">
                  Address cannot exceed 400 characters.
                </p>
              )}

              <p className="text-right text-xs text-slate-400">
                {address.length}/400
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                nameError ||
                emailError ||
                passwordError ||
                confirmPasswordError ||
                addressError
              }
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-7 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-slate-900 transition hover:text-slate-600"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
