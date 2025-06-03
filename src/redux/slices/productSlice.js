import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ color, price, category, sort, page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (color) query.append("color", color);
      if (category) query.append("category", category);
      if (sort) query.append("sort", sort);
      if (page) query.append("page", page);
      if (limit) query.append("limit", limit);

      if (price !== undefined && price !== "") {
        const isRange = String(price).includes("-");
        query.append("price", isRange ? price : `0-${price}`);
      }

      const url = `${BASE_URL}/api/product/products?${query}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/product/${productId}`);

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    totalProducts: 0,
    productsStatus: "idle",
    productStatus: "idle",
    productsError: null,
    productError: null,
  },
  reducers: {
    // you can add product-related reducers here if needed later
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.productsStatus = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsStatus = "succeeded";
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.totalProducts || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsStatus = "failed";
        state.productsError = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.productStatus = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productStatus = "succeeded";
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productStatus = "failed";
        state.productError = action.payload;
      });
  },
});

export default productSlice.reducer;
