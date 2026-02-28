import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MallHighlights from "./MallHighlights";
import getCookie from "../../utils";
import { API_BASE } from "../../utils";

const mockFeatures = [
  {
    title: "3D Map",
    description: "Explore the mall in 3D with floor navigation",
    path: "/map",
    icon: "🗺️",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    title: "Chatbot",
    description: "Get instant answers about stores & products",
    path: "/chat",
    icon: "💬",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    title: "Product Match",
    description: "Browse and search products with ease using images",
    path: "/scan",
    icon: "📸",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "SOS Alert",
    description: "Emergency assistance when you need it most",
    path: "/sos",
    icon: "🚨",
    gradient: "from-red-500 to-orange-600",
  },
];

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

const mockContactInfo = [
  { label: "Email", value: "contact@example.com", icon: "✉️" },
  { label: "Phone", value: "+1 234 567 890", icon: "📞" },
  { label: "Address", value: "123 Main St, Anytown, USA", icon: "📍" },
];

const HomePage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState({ visible: false, message: "" });
  const [activeSection, setActiveSection] = useState("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser?.name || "");

  const csrftoken = getCookie("csrftoken");

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
    }
  }, [storedUser, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        home: document.getElementById("home"),
        features: document.getElementById("features"),
        contact: document.getElementById("contact"),
      };
      for (const sectionId in sections) {
        if (sections[sectionId]) {
          const rect = sections[sectionId].getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowModal({
      visible: true,
      message: "Thank you! Your message has been sent.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    deleteCookie("csrftoken");
    try {
      const resp = await fetch(`${API_BASE}/api/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({}),
      });
      if (resp.ok) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during fetch:", error);
    }
    setUser(null);
    navigate("/login");
  };

  const closeModal = () => setShowModal({ visible: false, message: "" });

  const getNavLinkClasses = (sectionId) => {
    const base =
      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300";
    const active = "text-white bg-white/10";
    const inactive = "text-gray-400 hover:text-white hover:bg-white/5";
    return `${base} ${activeSection === sectionId ? active : inactive}`;
  };

  return (
    <div className="w-full bg-mesh relative font-sans min-h-screen">
      {/* Decorative orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/8 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="nav-glass fixed top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3.5">
          {/* Logo */}
          <div className="flex items-center gap-2">

            <span className="text-xl font-bold text-gradient tracking-tight">Smart Mall</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3" ref={dropdownRef}>
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              <a href="#home" className={getNavLinkClasses("home")}>Home</a>
              <a href="#features" className={getNavLinkClasses("features")}>Features</a>
              <a href="#contact" className={getNavLinkClasses("contact")}>Contact</a>
            </div>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 border-2 border-white/10"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64 glass-card p-4 animate-slide-up">
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.name || user}</div>
                        <div className="text-xs text-gray-400">Logged in</div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 text-white font-medium text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-gradient text-sm px-5 py-2.5"
              >
                Log In
              </button>
            )}

            {/* Hamburger Menu (Mobile) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {isMobileMenuOpen && (
                <div className="absolute top-16 right-4 mt-2 w-52 glass-card p-3 space-y-1 animate-slide-up">
                  <a href="#home" className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm">Home</a>
                  <a href="#features" className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm">Features</a>
                  <a href="#contact" className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm">Contact</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 text-white">
        {/* Hero */}
        <section
          id="home"
          className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-24"
        >
          {user ? (
            <MallHighlights />
          ) : (
            <div className="animate-slide-up">
              <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-6">
                ✨ Your Smart Shopping Experience
              </div>
              <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight">
                Welcome to
                <span className="block text-gradient mt-2">Smart Mall</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4">
                Explore. Shop. Experience. Your one-stop destination for fashion, food, and fun.
              </p>
              <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
                A modern platform that delivers the best experiences. Responsive, fast, and designed for the future.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <button
                  onClick={() => navigate("/login")}
                  className="btn-gradient px-8 py-3.5 text-base"
                >
                  Get Started
                </button>
                <button className="px-8 py-3.5 rounded-xl border border-white/15 text-gray-300 hover:bg-white/5 hover:border-white/25 hover:text-white transition-all duration-300 font-medium">
                  Learn More
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Separator */}
        <div className="relative w-full flex items-center justify-center py-4">
          <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        </div>

        {/* Features */}
        <section id="features" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-4">
              Explore Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              What We <span className="text-gradient">Offer</span>
            </h2>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
            {mockFeatures.map((feature, index) => (
              <button
                key={index}
                onClick={() => navigate(feature.path)}
                className="glass-card p-6 text-left group hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1.5 text-white group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Separator */}
        <div className="relative w-full flex items-center justify-center py-4">
          <div className="w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        </div>

        {/* Contact */}
        <section id="contact" className="py-20 px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-4">
                Contact Us
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Get in <span className="text-gradient">Touch</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Info */}
              <div>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  We'd love to hear from you! Send us a message or find our contact information below.
                </p>
                <div className="space-y-4">
                  {mockContactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="glass-card flex items-center p-4 group hover:border-indigo-500/25 transition-all duration-300"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mr-4 text-lg group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{item.label}</div>
                        <div className="text-gray-400 text-sm">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="gradient-border">
                <div className="glass-card p-7">
                  <h3 className="text-xl font-semibold mb-6 text-white">Send us a message</h3>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-glass"
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-glass"
                    />
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="input-glass min-h-[110px] resize-none"
                    />
                    <button type="submit" className="btn-gradient w-full py-3.5 text-base">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal.visible && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="glass-card p-8 text-center max-w-sm w-full mx-4 animate-slide-up border-indigo-500/20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Success!</h3>
            <p className="text-gray-400 mb-6">{showModal.message}</p>
            <button
              onClick={closeModal}
              className="btn-gradient px-8 py-2.5"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
