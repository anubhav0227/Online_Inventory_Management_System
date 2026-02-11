import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= FETCH PRODUCTS ================= */
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/products");

      return Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load products"
      );
    }
  }
);

/* ================= ADD PRODUCT ================= */
export const addProduct = createAsyncThunk(
  "products/add",
  async (product, thunkAPI) => {
    try {
      const res = await api.post("/products", product);
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to add product"
      );
    }
  }
);

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update product"
      );
    }
  }
);

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to delete product"
      );
    }
  }
);

/* ================= SLICE ================= */
const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(addProduct.fulfilled, (s, a) => {
        if (a.payload) s.list.push(a.payload);
      })

      .addCase(updateProduct.fulfilled, (s, a) => {
        if (!a.payload) return;
        s.list = s.list.map((p) =>
          p.id === a.payload.id ? a.payload : p
        );
      })

      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.list = s.list.filter((p) => p.id !== a.payload);
      });
  },
});

export default productSlice.reducer;
