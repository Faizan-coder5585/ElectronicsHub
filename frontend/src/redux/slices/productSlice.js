import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch Products with Filters
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ color, price, category, sort } = {}) => {
    try {
      const query = new URLSearchParams();
      if (color) query.append("color", color);
      if (price) query.append("price", price.includes("-") ? price : `${price}-`);
      if (category) query.append("category", category);
      if (sort) query.append("sort", sort);

      const url = `http://localhost:9000/api/product/products?${query}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }
);

// Product Slice
const productSlice = createSlice({
  name: "products",
  initialState: { products: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
