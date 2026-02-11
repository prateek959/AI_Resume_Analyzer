import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleLogin = async () => {
    setWarning(""); 
    if (!form.email || !form.password) {
      setWarning("Please fill in all fields.");
      return;
    }

    try {
      const res = await api.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Login failed";
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
          Resume AI Login
        </h1>

    
        {warning && (
          <div className="mb-4 p-3 bg-red-700/70 text-red-100 rounded-lg text-sm">
            {warning}
          </div>
        )}

        
        <div className="relative mb-6">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="
              w-full
              p-4
              rounded-xl
              bg-gray-800
              text-white
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:border-indigo-500
              transition
              duration-300
              ease-in-out
              caret-white
            "
          />
        </div>

       
        <div className="relative mb-8">
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="
              w-full
              p-4
              rounded-xl
              bg-gray-800
              text-white
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              focus:border-indigo-500
              transition
              duration-300
              ease-in-out
              caret-white
            "
          />
        </div>

       
        <button
          onClick={handleLogin}
          className="
            w-full
            bg-indigo-600
            text-white
            font-semibold
            p-4
            rounded-xl
            shadow-lg
            hover:bg-indigo-700
            hover:shadow-xl
            transform
            transition
            duration-300
            ease-in-out
            active:scale-95
          "
        >
          Login
        </button>

        
        <p className="mt-6 text-center text-gray-400">
          New user?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
