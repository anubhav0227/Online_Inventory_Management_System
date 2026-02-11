import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ================= FETCH CATEGORIES ================= */
export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/categories");
      return Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to load categories"
      );
    }
  }
);

/* ================= ADD CATEGORY ================= */
export const addCategory = createAsyncThunk(
  "categories/add",
  async (name, thunkAPI) => {
    try {
      const res = await api.post("/categories", { name });
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to add category"
      );
    }
  }
);

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, name }, thunkAPI) => {
    try {
      const res = await api.put(`/categories/${id}`, { name });
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to update category"
      );
    }
  }
);

/* ================= DELETE CATEGORY ================= */
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to delete category"
      );
    }
  }
);

/* ================= SLICE ================= */
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchCategories.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(addCategory.fulfilled, (s, a) => {
        if (a.payload) s.list.push(a.payload);
      })

      .addCase(updateCategory.fulfilled, (s, a) => {
        if (!a.payload) return;
        s.list = s.list.map((c) =>
          c.id === a.payload.id ? a.payload : c
        );
      })

      .addCase(deleteCategory.fulfilled, (s, a) => {
        s.list = s.list.filter((c) => c.id !== a.payload);
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
