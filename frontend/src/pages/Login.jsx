import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setShowModal }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
  try {
    if (isLogin) {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = res.data;
      alert("Login successful");

      localStorage.setItem(
        "user",
        JSON.stringify({ user, token })
      );

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } else {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Signup successful, please login");

      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    }

  } catch (err) {
    console.log(err?.response?.data || err);
    alert(err?.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-80 relative">

        {/* ❌ Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 text-xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Signup"}
        </h2>

        {!isLogin && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white w-full py-2 mt-2"
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-500 mt-3 text-center cursor-pointer"
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}