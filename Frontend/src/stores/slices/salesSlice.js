import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= FETCH ================= */
export const fetchSales = createAsyncThunk(
  "sales/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/sales");
      return Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load sales"
      );
    }
  }
);

/* ================= ADD ================= */
export const addSale = createAsyncThunk(
  "sales/add",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const res = await api.post("/sales", { productId, quantity });
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Insufficient stock"
      );
    }
  }
);

/* ================= UPDATE ================= */
export const updateSale = createAsyncThunk(
  "sales/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/sales/${id}`, data);
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update sale"
      );
    }
  }
);

/* ================= DELETE ================= */
export const deleteSale = createAsyncThunk(
  "sales/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/sales/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete sale"
      );
    }
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchSales.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchSales.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(addSale.fulfilled, (s, a) => {
        if (a.payload) s.list.unshift(a.payload);
      })

      .addCase(updateSale.fulfilled, (s, a) => {
        if (!a.payload) return;
        s.list = s.list.map((x) =>
          x.id === a.payload.id ? a.payload : x
        );
      })

      .addCase(deleteSale.fulfilled, (s, a) => {
        s.list = s.list.filter((x) => x.id !== a.payload);
      });
  },
});

export default salesSlice.reducer;
