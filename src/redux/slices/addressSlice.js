import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:9000/api/address";

// Helper to get token
const getAuthHeader = (getState) => {
  const token = getState().auth.token || localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 📌 1️⃣ Save Address
export const saveAddress = createAsyncThunk(
  "address/saveAddress",
  async (addressData, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/submit-address`, addressData, getAuthHeader(getState));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);

// 📌 2️⃣ Get All Addresses
export const getAllAddresses = createAsyncThunk(
  "address/getAllAddresses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/all`, getAuthHeader(getState));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);

// 📌 3️⃣ Get Address by ID
export const getAddressById = createAsyncThunk(
  "address/getAddressById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/${id}`, getAuthHeader(getState));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);

// 📌 4️⃣ Update Address
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, updatedData }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, updatedData, getAuthHeader(getState));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);

// 📌 5️⃣ Delete Address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, getAuthHeader(getState));
      return id; // return the deleted id
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Unknown error" });
    }
  }
);

// Slice
const addressSlice = createSlice({
  name: "address",
  initialState: {
    address: null,
    addresses: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Save
      .addCase(saveAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.address = action.payload.address; // ✅ Fix here
        state.addresses.push(action.payload.address); // // Append new address
      })
      .addCase(saveAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllAddresses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = action.payload;
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Get By ID
      .addCase(getAddressById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAddressById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.address = action.payload;
      })
      .addCase(getAddressById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update
      .addCase(updateAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.address = action.payload.address;
        state.addresses = state.addresses.map((addr) =>
          addr._id === action.payload.address._id ? action.payload.address : addr
        );
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addresses = state.addresses.filter((addr) => addr._id !== action.payload);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
