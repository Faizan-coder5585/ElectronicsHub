import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for registering user
export const RegisterUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:9000/api/user/register', userData); // Adjust URL if needed
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Thunk for verifying OTP
export const VerifyOTP = createAsyncThunk('auth/verifyOtp', async (otpData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:9000/api/user/verify-otp', otpData); // Adjust URL if needed
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Thunk for logging in user
export const LoginUser = createAsyncThunk('auth/login', async (loginData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:9000/api/user/login', loginData); // Adjust URL if needed
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        otpVerified: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(RegisterUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(RegisterUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(VerifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(VerifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.otpVerified = true;
            })
            .addCase(VerifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;
