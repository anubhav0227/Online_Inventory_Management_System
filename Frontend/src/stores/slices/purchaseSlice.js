// ../../stores/slices/purchaseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= FETCH PURCHASES ================= */
export const fetchPurchases = createAsyncThunk(
  "purchases/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/purchases");
      return Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load purchases"
      );
    }
  }
);

/* ================= ADD PURCHASE ================= */
export const addPurchase = createAsyncThunk(
  "purchases/add",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/purchases", payload);
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to add purchase"
      );
    }
  }
);

/* ================= UPDATE PURCHASE ================= */
export const updatePurchase = createAsyncThunk(
  "purchases/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/purchases/${id}`, data);
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update purchase"
      );
    }
  }
);

/* ================= DELETE PURCHASE =================
   Accepts either a plain id (number | string) or an object { id }.
   Normalizes id to Number and returns it on success.
*/
export const deletePurchase = createAsyncThunk(
  "purchases/delete",
  async (payload, thunkAPI) => {
    try {
      // accept either id or { id }
      const id = payload && typeof payload === "object" && payload.id != null ? payload.id : payload;
      const numericId = Number(id);
      if (!numericId) {
        return thunkAPI.rejectWithValue("Invalid id for deletePurchase");
      }

      await api.delete(`/purchases/${numericId}`);
      return numericId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete purchase"
      );
    }
  }
);

/* ================= SLICE ================= */
const purchaseSlice = createSlice({
  name: "purchases",
  initialState: {
    list: [],
    loading: false,
    error: null,
    deletingId: null, // optional: track which id is being deleted
  },
  reducers: {
    clearPurchaseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPurchases.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchPurchases.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // ADD
      .addCase(addPurchase.fulfilled, (s, a) => {
        if (a.payload) s.list.unshift(a.payload);
      })

      // UPDATE
      .addCase(updatePurchase.fulfilled, (s, a) => {
        if (!a.payload) return;
        s.list = s.list.map((p) => (p.id === a.payload.id ? a.payload : p));
      })

      // DELETE: pending / fulfilled / rejected
      .addCase(deletePurchase.pending, (s, a) => {
        s.error = null;
        s.deletingId = a.meta?.arg && typeof a.meta.arg === "object" && a.meta.arg.id != null ? Number(a.meta.arg.id) : Number(a.meta.arg || 0);
      })
      .addCase(deletePurchase.fulfilled, (s, a) => {
        const deletedId = Number(a.payload);
        s.list = s.list.filter((p) => Number(p.id) !== deletedId);
        // clear deletingId if it matched
        if (s.deletingId === deletedId) s.deletingId = null;
      })
      .addCase(deletePurchase.rejected, (s, a) => {
        s.error = a.payload || a.error?.message || "Failed to delete";
        s.deletingId = null;
      });
  },
});

export const { clearPurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
