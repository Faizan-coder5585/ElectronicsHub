import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Axios instance
const API = axios.create({
  baseURL: process.env.BACKEND_API_UR || 'http://localhost:9000/api',
});

// Attach token to request headers
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to get token
const getTokenFromStateOrStorage = (getState) => {
  const state = getState();
  return (
    state?.auth?.user?.token ||
    (typeof window !== 'undefined' && localStorage.getItem('token'))
  );
};

// 1. Place Order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ products, totalAmount }, { getState, rejectWithValue }) => {
    try {
      const token = getTokenFromStateOrStorage(getState);

      const response = await API.post('/orders/place-order', { products, totalAmount }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 2. Get order details by ID
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const token = getTokenFromStateOrStorage(getState);

      const response = await API.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 3. Get all orders for the logged-in user
export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getTokenFromStateOrStorage(getState);

      const response = await API.get('/orders/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// 4. Update payment status
export const updatePaymentStatus = createAsyncThunk(
  'order/updatePaymentStatus',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const token = getTokenFromStateOrStorage(getState);

      const response = await API.patch('/orders/update-payment', { orderId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const token = getTokenFromStateOrStorage(getState);

      await API.delete(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return orderId; // just return the deleted order ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = null; // <--- optional backup
        state.orders = state.orders.filter(orders => orders._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
