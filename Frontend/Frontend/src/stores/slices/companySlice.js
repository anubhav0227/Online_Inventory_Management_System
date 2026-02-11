// src/stores/slices/companySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

/**
 * Simple in-memory fake DB for companies.
 * Replace with API calls later if you have a backend.
 */
let fakeCompanies = [
  // sample seed (optional)
  // { id: 1, name: "Acme Ltd", email: "hello@acme.com", phone: "9999999999", role: "company" }
];

// Fetch all companies
export const fetchCompanies = createAsyncThunk("companies/fetch", async () => {
  // emulate async
  return new Promise((resolve) => {
    setTimeout(() => resolve(fakeCompanies.slice()), 120);
  });
});

// Register / add a company
export const registerCompany = createAsyncThunk(
  "companies/register",
  async (payload) => {
    const newCompany = { id: Date.now(), ...payload };
    fakeCompanies.push(newCompany);
    return newCompany;
  }
);

// Delete a company by id
export const deleteCompany = createAsyncThunk("companies/delete", async (id) => {
  fakeCompanies = fakeCompanies.filter((c) => c.id !== id);
  return id;
});

const companySlice = createSlice({
  name: "companies",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // optional sync reducers if needed later
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // register
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.list.push(action.payload);
        toast.success("Company registered");
      })

      // delete
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        toast.success("Company deleted");
      });
  },
});

export default companySlice.reducer;
