import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // CAPTCHA-related states
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Generate CAPTCHA when page loads
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setNum1(a);
    setNum2(b);
    setCaptchaAnswer("");
    setCaptchaError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const correctAnswer = num1 + num2;

    if (parseInt(captchaAnswer) !== correctAnswer) {
      setCaptchaError("Incorrect CAPTCHA answer. Please try again.");
      generateCaptcha();
      return;
    }

    const success = login(email, password);

    if (success) {
      if (email.includes("lecturer")) {
        router.push("/lecturer-dashboard");
      } else {
        router.push("/tutor-dashboard");
      }
    } else {
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* CAPTCHA Section */}
        <div>
          <label className="block text-sm mb-1">
            What is {num1} + {num2}? (CAPTCHA)
          </label>
          <input
            type="number"
            className="p-2 border rounded w-full"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            required
          />
          {captchaError && (
            <p className="text-sm text-red-600 mt-1">{captchaError}</p>
          )}
        </div>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </div>
  );
}
