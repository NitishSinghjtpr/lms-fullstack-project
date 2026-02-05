

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axiosInstance from './../../Helper/axiosInstance';

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
};

// ===========================
// Get Razorpay Key
// ===========================
export const getRazorpayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await axiosInstance.get("/payments/razorpay-key");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load data");
        throw error;
    }
});

// ===========================
// Create Subscription
// ===========================
export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
    try {
        const response = await axiosInstance.post("/payments/subscribe");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong!");
        throw error;
    }
});

// ===========================
// Verify Payment
// ===========================
export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data) => {
    try {
        const response = await axiosInstance.post("/payments/verify", {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        });
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Payment failed!");
        throw error;
    }
});

// ===========================
// Get Payment Records
// ===========================
export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = axiosInstance.get("/payments?count=100");

        toast.promise(response, {
            loading: "Getting the payments record",
            success: (data) => data?.data?.message,
            error: "Failed to get payment records"
        });

        return (await response).data;

    } catch (error) {
        toast.error("Operation failed");
    }
});

// ===========================
// Cancel Subscription
// ===========================
export const cancleCourseBundle = createAsyncThunk("/payments/cancle", async () => {
    try {
        const response = axiosInstance.post("/payments/unsubscribe");

        toast.promise(response, {
            loading: "Unsubscribing the bundle",
            success: (data) => data?.data?.message,
            error: "Failed to unsubscribe"
        });

        return (await response).data;

    } catch (error) {
        toast.error("Operation failed");
    }
});

// ===========================
// Slice
// ===========================
const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getRazorpayId.fulfilled, (state, action) => {
                state.key = action?.payload?.key;
            })

            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                state.subscription_id = action?.payload?.subscription_id;
            })

            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                toast.success(action?.payload?.message);
                state.isPaymentVerified = true;
            })

            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                state.allPayments = action?.payload?.subscriptions || [];

                // 🔥 FIXED: backend does NOT return these fields for /payments route
                state.finalMonths = {};
                state.monthlySalesRecord = [];
            });
    }
});

export default razorpaySlice.reducer;
