import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks
export const RegisterUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:9000/api/user/register', userData);
        return response.data; // Expected: { message, user }
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const VerifyOTP = createAsyncThunk(
    'auth/verifyOtp',
    async (otpData, { getState, rejectWithValue }) => {
        const state = getState();
        const token = localStorage.getItem('token') || state.auth.token;

        try {
            const response = await axios.post('http://localhost:9000/api/user/verify-otp', otpData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Expected: { user, token }
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const LoginUser = createAsyncThunk('auth/login', async (loginData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:9000/api/user/login', loginData);
        return response.data; // Expected: { user, token }
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const LogoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        // Optionally call server to invalidate token
        return true;
    } catch (err) {
        return rejectWithValue('Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
        loading: false,
        error: null,
        otpVerified: false,
        redirectTo: typeof window !== 'undefined' ? localStorage.getItem('redirectTo') : null,
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    },
    reducers: {
        setRedirectTo: (state, action) => {
            state.redirectTo = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('redirectTo', action.payload);
            }
        },
        clearRedirectTo: (state) => {
            state.redirectTo = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('redirectTo');
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.otpVerified = false;
            state.redirectTo = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(RegisterUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.user = action.payload.user || null;
                state.token = null; // Token is set after OTP verification
                state.otpVerified = false;
                state.loading = false;
            })
            .addCase(RegisterUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // OTP Verify
            .addCase(VerifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(VerifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.otpVerified = true;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user)); // <-- add this
                state.error = null;
            })
            .addCase(VerifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'OTP verification failed';
            })

            // Login
            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.otpVerified = true;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user)); // <-- add this
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout
            .addCase(LogoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.otpVerified = false;
                state.redirectTo = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user'); // clear user too
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.error = action.payload || 'Logout failed';
            });
    }
});

export const { setRedirectTo, clearRedirectTo, logout } = authSlice.actions;
export default authSlice.reducer;
