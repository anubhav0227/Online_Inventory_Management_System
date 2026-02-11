import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* =====================================================
   FETCH COMPANIES (ADMIN)
   GET /api/admin/companies
===================================================== */
export const fetchCompanies = createAsyncThunk(
  "companies/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/admin/companies");
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load companies"
      );
    }
  }
);

/* =====================================================
   REGISTER COMPANY (PUBLIC)
   POST /api/auth/register
===================================================== */
export const registerCompany = createAsyncThunk(
  "companies/register",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Company registration failed"
      );
    }
  }
);

/* =====================================================
   UPDATE COMPANY STATUS (ADMIN)
   PATCH /api/admin/companies/{id}/status
===================================================== */
export const updateCompanyStatus = createAsyncThunk(
  "companies/updateStatus",
  async ({ id, active }, thunkAPI) => {
    try {
      const res = await api.patch(
        `/admin/companies/${id}/status`,
        { active }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to update company status"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */
const companySlice = createSlice({
  name: "companies",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== FETCH =====
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== REGISTER =====
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== UPDATE STATUS =====
      .addCase(updateCompanyStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((c) =>
          c.id === action.payload.id ? action.payload : c
        );
      })
      .addCase(updateCompanyStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
