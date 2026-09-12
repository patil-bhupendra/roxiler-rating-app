import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailError = email.length > 0 && !emailRegex.test(email);

  const passwordError = password.length === 0;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      return;
    }

    if (!password) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else if (data.user.role === "OWNER") {
        navigate("/owner");
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
        <div className="bg-slate-900 px-8 py-8 text-white">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Roxiler Rating APP
              </h1>
            </div>
          </div>
        </div>

        <div className="px-8 pt-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">Welcome</h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                autoComplete="current-password"
                required
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
                  passwordError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                }`}
              />

              {passwordError && (
                <p className="text-xs font-medium text-red-600">
                  Password is required.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={emailError || passwordError}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sign in
            </button>
          </form>

          <div className="mt-7 border-t border-slate-200 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-slate-900 transition hover:text-slate-600"
              >
                Register
              </button>
            </p>
          </div>

          <p className="py-7 text-center text-xs text-slate-400">
            Secure access for administrators, store owners and users.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
