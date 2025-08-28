"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../lib/auth";
import { useAuth } from "../../../lib/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const user = await loginUser(email, password);

    setLoading(false);

    if (user) {
      // sigurnije mapiranje koji osigurava da email i fullName budu stringovi
      const safeUser = {
        id: user.id,
        email:
          typeof user.email === "string" && user.email !== null
            ? user.email
            : "",
        fullName:
          typeof user.fullName === "string" && user.fullName !== null
            ? user.fullName
            : "",
      };
      login(safeUser);
      alert(`Uspješno prijavljen: ${safeUser.fullName}`);
      router.push("/");
    } else {
      setErrorMsg("Invalid email or password");
    }
  };
  return (
    <div className="h-screen flex mt-20 items-start justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-5 text-[#593E2E] text-center">
          Login
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-md font-bold mb-1 text-[#593E2E]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 bg-white text-[#593E2E]"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-md font-bold mb-1 text-[#593E2E]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2 bg-white text-[#593E2E] mb-4"
              required
              disabled={loading}
            />
          </div>

          {errorMsg && (
            <p className="text-red-600 mb-4 text-center font-semibold">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full text-white py-2 rounded-lg bg-[#593E2E] hover:bg-[#8C6954] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
