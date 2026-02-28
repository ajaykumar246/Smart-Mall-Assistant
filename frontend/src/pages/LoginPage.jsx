import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../../utils";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState("customer");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.name,
        password: formData.password,
      }),
    })
      .then((resp) => {
        if (!resp.ok) {
          return resp.json().then((errorData) => {
            throw new Error(errorData.error || "Login failed.");
          });
        }
        return resp.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("user", JSON.stringify({ name: formData.name }));
        alert("Login successful!");
        navigate("/");
        localStorage.setItem("authToken", data.token);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-mesh relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
        <div className="gradient-border">
          <div className="glass-card p-8">
            {/* Type toggle */}
            <div className="flex justify-center mb-6 gap-2 p-1 bg-white/5 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginType("customer")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${loginType === "customer"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setLoginType("retailer")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${loginType === "retailer"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                Retailer
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-1 text-white">Welcome back</h1>
            <p className="text-center text-gray-400 text-sm mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your username"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-glass"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-glass pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-gradient w-full py-3.5 text-base mt-2">
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
