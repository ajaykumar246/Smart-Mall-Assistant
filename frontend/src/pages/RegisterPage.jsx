import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../../utils";

function RegisterPage() {
  const [registerType, setRegisterType] = useState("customer");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    category: "",
    description: "",
    tags: [],
    tagInput: "",
    floor: "",
    shopName: "",
  });

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(" ") || value.endsWith(",") || value.endsWith("#") || e.key === "Enter") {
      const tag = value.replace(/[# ,]/g, "").trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
      } else {
        setFormData((prev) => ({ ...prev, tagInput: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, tagInput: value }));
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (
      !(
        passwordValidations.length &&
        passwordValidations.upper &&
        passwordValidations.lower &&
        passwordValidations.number &&
        passwordValidations.special
      )
    ) {
      alert("Password is not strong enough!");
      return;
    }

    let endpoint;
    let data;

    if (registerType === "customer") {
      endpoint = `${API_BASE}/api/register/`;
      data = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      };
    } else if (registerType === "retailer") {
      endpoint = `${API_BASE}/api/shop/register/`;
      data = {
        owner_name: formData.name,
        email: formData.email,
        password: formData.password,
        shop_name: formData.shopName,
        floor: formData.floor,
        category: formData.category,
        description: formData.description,
        product_tags: formData.tags,
      };
    } else {
      alert("Invalid registration type.");
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            const errorMessage = Object.values(errorData).flat().join(" ");
            throw new Error(errorMessage || "Registration failed.");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registration successful:", data);
        alert("Registration successful! You can now log in.");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration error:", err);
        setShowConfirmPassword(err.message);
      });
  };

  const ValidationRule = ({ valid, label }) => (
    <div className={`flex items-center gap-2 text-xs ${valid ? "text-emerald-400" : "text-gray-500"}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${valid ? "bg-emerald-400" : "bg-gray-600"}`} />
      {label}
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-mesh relative overflow-hidden py-12">
      {/* Decorative orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-3xl" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
        <div className="gradient-border">
          <div className="glass-card p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
            {/* Type toggle */}
            <div className="flex justify-center mb-6 gap-2 p-1 bg-white/5 rounded-xl">
              <button
                type="button"
                onClick={() => setRegisterType("customer")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${registerType === "customer"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRegisterType("retailer")}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${registerType === "retailer"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                Retailer
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-1 text-white">Create account</h1>
            <p className="text-center text-gray-400 text-sm mb-8">Join Smart Mall today</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Retailer-specific fields */}
              {registerType === "retailer" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      className="input-glass"
                      placeholder="Enter your shop name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Floor</label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      className="input-glass"
                      placeholder="e.g. Ground, 1st, 2nd, etc."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-glass appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="bg-gray-900">Select Category</option>
                      <option value="Clothing" className="bg-gray-900">Clothing</option>
                      <option value="Electronics" className="bg-gray-900">Electronics</option>
                      <option value="Food" className="bg-gray-900">Food</option>
                      <option value="Accessories" className="bg-gray-900">Accessories</option>
                      <option value="Home" className="bg-gray-900">Home</option>
                      <option value="Other" className="bg-gray-900">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-glass min-h-[70px] resize-none"
                      placeholder="Describe your shop or offerings..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Product Tags</label>
                    <input
                      type="text"
                      name="tagInput"
                      value={formData.tagInput}
                      onChange={handleTagInput}
                      onKeyDown={handleTagInput}
                      className="input-glass"
                      placeholder="Type a tag and press space or comma"
                    />
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/30"
                          >
                            #{tag}
                            <button
                              type="button"
                              className="ml-1.5 text-indigo-400 hover:text-red-400 transition-colors"
                              onClick={() => removeTag(tag)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="input-glass"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    autoComplete="new-password"
                    onChange={handleChange}
                    onFocus={() => setShowRules(true)}
                    onBlur={() => setShowRules(false)}
                    className="input-glass pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  {/* Password rules popup */}
                  {showRules && (
                    <div className="absolute top-full mt-2 left-0 w-full glass-card p-4 z-10 space-y-1.5">
                      <ValidationRule valid={passwordValidations.length} label="At least 8 characters" />
                      <ValidationRule valid={passwordValidations.upper} label="One uppercase letter" />
                      <ValidationRule valid={passwordValidations.lower} label="One lowercase letter" />
                      <ValidationRule valid={passwordValidations.number} label="One number" />
                      <ValidationRule valid={passwordValidations.special} label="One special character (!@#$%^&*)" />
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-glass pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${formData.password === formData.confirmPassword ? "text-emerald-400" : "text-red-400"
                    }`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${formData.password === formData.confirmPassword ? "bg-emerald-400" : "bg-red-400"
                      }`} />
                    {formData.password === formData.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="btn-gradient w-full py-3.5 text-base mt-2">
                Create Account
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
