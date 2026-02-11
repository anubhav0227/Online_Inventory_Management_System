import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let fakePurchases = [];

export const fetchPurchases = createAsyncThunk("purchases/fetch", async () => fakePurchases);

export const addPurchase = createAsyncThunk("purchases/add", async (purchase) => {
  const newPurchase = { id: Date.now(), ...purchase };
  fakePurchases.push(newPurchase);
  return newPurchase;
});

export const updatePurchase = createAsyncThunk("purchases/update", async ({ id, data }) => {
  fakePurchases = fakePurchases.map((p) => (p.id === id ? { ...p, ...data } : p));
  return { id, data };
});

export const deletePurchase = createAsyncThunk("purchases/delete", async (id) => {
  fakePurchases = fakePurchases.filter((p) => p.id !== id);
  return id;
});

const purchaseSlice = createSlice({
  name: "purchases",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (s) => { s.loading = true; })
      .addCase(fetchPurchases.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(addPurchase.fulfilled, (s, a) => { s.list.push(a.payload); })
      .addCase(updatePurchase.fulfilled, (s, a) => {
        s.list = s.list.map((it) => (it.id === a.payload.id ? { ...it, ...a.payload.data } : it));
      })
      .addCase(deletePurchase.fulfilled, (s, a) => {
        s.list = s.list.filter((it) => it.id !== a.payload);
      });
  },
});

export default purchaseSlice.reducer;
