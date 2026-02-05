import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helper/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  role: localStorage.getItem("role") || "",
  data: (() => {
    const saved = localStorage.getItem("data");
    if (!saved || saved === "undefined" || saved === "") return {};
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  })(),
};

// ================= CREATE ACCOUNT =================
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const resPromise = axiosInstance.post("/user/register", data);

    toast.promise(resPromise, {
      loading: "Creating your account...",
      success: (data) => data?.data?.message,
      error: "Failed to create account",
    });

    return (await resPromise).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

// ================= LOGIN =================
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const resPromise = axiosInstance.post("/user/login", data);

    toast.promise(resPromise, {
      loading: "Please wait for login...",
      success: (data) => data?.data?.message,
      error: "Failed to Login",
    });

    return (await resPromise).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    throw error;
  }
});

// ================= LOGOUT =================
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const resPromise = axiosInstance.get("/user/logout");

    toast.promise(resPromise, {
      loading: "Wait! logout in progress...",
      success: (data) => data?.data?.message,
      error: "Failed to logout",
    });

    return (await resPromise).data;
  } catch (error) {
    toast.error(error?.response?.message);
    throw error;
  }
});

// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async ({ id, formData }) => {
    try {
      const resPromise = axiosInstance.put(
        `/user/update/profile/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      toast.promise(resPromise, {
        loading: "Wait! profile update in progress...",
        success: (data) => data?.data?.message,
        error: "Failed to update profile",
      });

      return (await resPromise).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  },
);

// ================= GET PROFILE (FIXED) =================
export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = axiosInstance.get("/user/profile");
    return (await res).data; // backend returns { success, data }
  } catch (error) {
    toast.error(error.message);
  }
});

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(login.fulfilled, (state, action) => {
        const userData = action?.payload?.user; // login returns { user }

        localStorage.setItem("data", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", userData?.role?.toLowerCase());

        state.isLoggedIn = true;
        state.data = userData;
        state.role = userData?.role?.toLowerCase();
      })

      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      })

      // ⭐ FIXED BLOCK — subscription update karega
      .addCase(getUserData.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.data));
        localStorage.setItem("role", action?.payload?.data?.role);
        localStorage.setItem("isLoggedIn", "true");

        state.isLoggedIn = true;
        state.data = action?.payload?.data;
        state.role = action?.payload?.data?.role;
      });
  },
});

export default authSlice.reducer;
