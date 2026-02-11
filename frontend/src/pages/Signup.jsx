import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [warning, setWarning] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  // Validation function
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email is invalid";
    }
    if (!form.password.trim()) {
      errs.password = "Password is required";
    } else if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    setWarning(""); // reset server warning
    if (!validate()) return;

    try {
      await api.post("/user/register", form);
      navigate("/"); // redirect to login after success
    } catch (err) {
      // Show inline warning instead of alert
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Signup failed. Please try again.";
      setWarning(msg);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 to-black">

      
      <style>{`
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #1f2937 inset;
          -webkit-text-fill-color: white;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div className="bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white tracking-tight">
          Create Account
        </h1>

        {/* Server warning message */}
        {warning && (
          <div className="mb-4 p-3 bg-red-700/70 text-red-100 rounded-lg text-sm">
            {warning}
          </div>
        )}

        {/* Name Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className={`w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out caret-white ${
              errors.name ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="relative mb-4">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className={`w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out caret-white ${
              errors.email ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className={`w-full p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out caret-white ${
              errors.password ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password}</p>}
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-indigo-600 text-white font-semibold p-4 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transform transition duration-300 ease-in-out active:scale-95"
        >
          Signup
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
