

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  allUsersCount: 0,
  subscribedCount: 0,
  totalRevenue: 0,
  monthlySalesRecord: [],
};

export const getStatsData = createAsyncThunk("stats/get", async () => {
  try {
    const responsePromise = axiosInstance.get("/admin/analytics");

    toast.promise(responsePromise, {
      loading: "Getting stats...",
      success: (d) => d?.data?.message,
      error: "Failed to load stats",
    });

    const response = await responsePromise;
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const statSlice = createSlice({
  name: "stat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(getStatsData.fulfilled, (state, action) => {
      const data = action.payload.analytics;

      state.allUsersCount = data?.totalUsers || 0;
      state.subscribedCount = data?.subscriptionStats?.active || 0;

      // ADD THESE TWO LINES (CRITICAL)
      state.totalRevenue = data?.totalRevenue || 0;
      state.monthlySalesRecord = data?.monthlySalesRecord || [];
    });
  },
});

export default statSlice.reducer;
