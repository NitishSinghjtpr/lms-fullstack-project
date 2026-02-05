import React, { useState } from "react";
import axiosInstance from "../../Helper/axiosInstance";
import { toast } from "react-hot-toast";
import HomeLayout from "../../layout/HomeLayout";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password & confirm password do not match");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/change-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      toast.success(response.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={handleSubmit}
          className="w-96 text-white shadow-[0_0_10px_black] p-5 flex flex-col gap-4 bg-[#111827] rounded-md"
        >
          <h1 className="text-2xl font-bold text-center">Change Password</h1>

          <input
            type="password"
            placeholder="Enter old password"
            className="bg-transparent border px-2 py-2 rounded-sm"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter new password"
            className="bg-transparent border px-2 py-2 rounded-sm"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="bg-transparent border px-2 py-2 rounded-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-yellow-600 py-2 rounded-sm hover:bg-yellow-500 transition-all font-semibold"
          >
            Update Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}
