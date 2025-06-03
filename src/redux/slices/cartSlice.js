import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item._id === product._id);

      if (existingProduct) {
        existingProduct.quantity += product.quantity;
      } else {
        state.cart.push({ ...product, quantity: product.quantity });
      }

      saveCartToStorage(state.cart);
      toast.success(`${product.name} added to cart!`, { position: "top-right", autoClose: 2000 });
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item._id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      saveCartToStorage(state.cart);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
      saveCartToStorage(state.cart);
      toast.info("Product removed from cart", { position: "top-right", autoClose: 2000 });
    },
    clearCart: (state) => {
      state.cart = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    },
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
