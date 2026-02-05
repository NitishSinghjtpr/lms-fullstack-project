import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeLayout from "../../layout/HomeLayout.jsx";
import axiosInstance from "../../Helper/axiosInstance.js";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { resetToken } = useParams();   // 🔥 Correct variable name
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
console.log("RESET TOKEN FROM URL:", resetToken); 
  async function handleSubmit(e) {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter password");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/user/reset-password/${resetToken}`,   // 🔥 Correct API call
        { password }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong!"
      );
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleSubmit}
          className="w-96 text-white shadow-[0_0_10px_black] p-4 flex flex-col gap-3"
        >
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>

          <input
            type="password"
            placeholder="Enter new password"
            className="bg-transparent border px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-yellow-600 py-2 rounded-sm hover:bg-yellow-500 transition-all"
          >
            Change Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default ResetPassword;
