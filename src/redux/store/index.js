'use client';

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from '../../utils/storage'; // your localStorage wrapper

import authReducer from '../slices/authSlice';
import productReducer from '../slices/productSlice';
import addressReducer from '../slices/addressSlice';
import paymentReducer from '../slices/paymentSlice';
import orderReducer from '../slices/orderSlice';
import cartReducer from '../slices/cartSlice';

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'],
};

// Persist config for address
const addressPersistConfig = {
  key: 'address',
  storage,
  whitelist: ['address'],
};

// Persist config for orders
const orderPersistConfig = {
  key: 'orders',
  storage,
  whitelist: ['orderDetails ', 'orders'],
};

// ✅ Add persist config for cart
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['cart'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  address: persistReducer(addressPersistConfig, addressReducer),
  products: productReducer,
  cart: persistReducer(cartPersistConfig, cartReducer), // ✅ persisted now
  payment: paymentReducer,
  orders: persistReducer(orderPersistConfig, orderReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
