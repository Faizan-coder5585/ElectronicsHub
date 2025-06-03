import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create Razorpay Order
export const createRazorpayOrder = createAsyncThunk(
  "payment/createRazorpayOrder",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:9000/api/payments/create-order", { orderId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create Razorpay order");
    }
  }
);

// Verify Razorpay Payment
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:9000/api/payments/verify-payment", paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Payment verification failed");
    }
  }
);

// Fetch updated order after successful payment
export const fetchOrder = createAsyncThunk(
  "payment/fetchOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/order/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order");
    }
  }
);

const initialState = {
  orderCreation: {
    loading: false,
    orderData: null,
    error: null,
  },
  verification: {
    loading: false,
    paymentInfo: null,
    orderStatus: null,
    error: null,
  },
  latestOrder: null,
  orderDetails: [],
  status: "idle", // idle | pending | verifying | success | failed
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.orderCreation = {
        loading: false,
        orderData: null,
        error: null,
      };
      state.verification = {
        loading: false,
        paymentInfo: null,
        orderStatus: null,
        error: null,
      };
      state.latestOrder = null;
      state.orderDetails = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Razorpay Order Creation
      .addCase(createRazorpayOrder.pending, (state) => {
        state.orderCreation.loading = true;
        state.orderCreation.error = null;
        state.status = "pending";
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.orderCreation.loading = false;
        state.orderCreation.orderData = action.payload;
        state.status = "idle";
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.orderCreation.loading = false;
        state.orderCreation.error = action.payload;
        state.status = "failed";
      })

      // Payment Verification
      .addCase(verifyPayment.pending, (state) => {
        state.verification.loading = true;
        state.verification.error = null;
        state.status = "verifying";
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verification.loading = false;
        state.verification.paymentInfo = action.payload.paymentInfo;
        state.verification.orderStatus = action.payload.orderStatus || "Success";
        state.status = "success";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verification.loading = false;
        state.verification.error = action.payload;
        state.status = "failed";
      })

      // Fetch Updated Order
      .addCase(fetchOrder.fulfilled, (state, action) => {
        const order = action.payload;

        state.latestOrder = order;
        state.orderDetails = order.orderDetails || [];

        // Update order status safely
        state.verification.orderStatus =
          order.paymentStatus || order.status || "Unknown";
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        console.error("Fetch order failed:", action.payload);
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
