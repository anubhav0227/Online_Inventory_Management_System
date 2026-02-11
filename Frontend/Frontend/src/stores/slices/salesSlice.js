import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let fakeSales = [];

export const fetchSales = createAsyncThunk("sales/fetch", async () => fakeSales);

export const addSale = createAsyncThunk("sales/add", async (sale) => {
  const newSale = { id: Date.now(), ...sale };
  fakeSales.push(newSale);
  return newSale;
});

export const updateSale = createAsyncThunk("sales/update", async ({ id, data }) => {
  fakeSales = fakeSales.map((s) => (s.id === id ? { ...s, ...data } : s));
  return { id, data };
});

export const deleteSale = createAsyncThunk("sales/delete", async (id) => {
  fakeSales = fakeSales.filter((s) => s.id !== id);
  return id;
});

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (s) => { s.loading = true; })
      .addCase(fetchSales.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchSales.rejected, (s, a) => { s.loading = false; s.error = a.error; })

      .addCase(addSale.fulfilled, (s, a) => { s.list.push(a.payload); })

      .addCase(updateSale.fulfilled, (s, a) => {
        s.list = s.list.map((it) => (it.id === a.payload.id ? { ...it, ...a.payload.data } : it));
      })

      .addCase(deleteSale.fulfilled, (s, a) => {
        s.list = s.list.filter((it) => it.id !== a.payload);
      });
  },
});

export default salesSlice.reducer;
