import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function SignInTutor() {
  const router = useRouter();
  const { login_Admin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [num1, setNum1] = useState(0);
  const [message, setMessage] = useState("");

   useEffect(() => {
      setNum1(Math.floor(Math.random() * 1000000) + 1);
    }, []);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (parseInt(captchaAnswer) !== num1) {
        setMessage("CAPTCHA is incorrect");
        return;
      }
  
      const success = login_Admin(email, password);
      if (success) {
        setMessage("");
        router.push("/lecturer-dashboard"); 
      } else {
        setMessage("Invalid email or password");
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-gray-800 relative">

        
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 left-4 text-gray-600 hover:text-blue-600"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Lecturer Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm mb-1 font-medium">
            CAPTCHA: {num1}
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          {message && (
            <p className="text-sm text-center mt-2 text-red-600">{message}</p>
          )}
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => router.push("/signup.tsx")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
