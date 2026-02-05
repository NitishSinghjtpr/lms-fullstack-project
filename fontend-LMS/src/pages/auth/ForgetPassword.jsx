import React, { useState } from "react";
import HomeLayout from "../../layout/HomeLayout.jsx";
import toast from "react-hot-toast";
import axiosInstance from "../../Helper/axiosInstance.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const response = await axiosInstance.post("/user/forgot-password", {
      email,
    });

    if (response?.data?.success) {
      toast.success(response?.data?.message);
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleSubmit}
          className="w-96 text-white shadow-[0_0_10px_black] p-4 flex flex-col gap-3"
        >
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>

          <input
            type="email"
            placeholder="Enter your registered email"
            className="bg-transparent border px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="bg-yellow-600 py-2 rounded-sm hover:bg-yellow-500 transition-all"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default ForgotPassword;
