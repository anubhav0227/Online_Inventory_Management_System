import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

let fakeProducts = []; // in-memory

export const fetchProducts = createAsyncThunk("products/fetch", async () => fakeProducts);

export const addProduct = createAsyncThunk("products/add", async (product) => {
  const newProduct = { id: Date.now(), ...product };
  fakeProducts.push(newProduct);
  return newProduct;
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, data }) => {
  fakeProducts = fakeProducts.map((p) => (p.id === id ? { ...p, ...data } : p));
  return { id, data };
});

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  fakeProducts = fakeProducts.filter((p) => p.id !== id);
  return id;
});

const productSlice = createSlice({
  name: "products",
  initialState: { list: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })

      .addCase(addProduct.fulfilled, (s, a) => {
        s.list.push(a.payload);
        toast.success("Product added");
      })

      .addCase(updateProduct.fulfilled, (s, a) => {
        s.list = s.list.map((p) =>
          p.id === a.payload.id ? { ...p, ...a.payload.data } : p
        );
        toast.success("Product updated");
      })

      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.list = s.list.filter((p) => p.id !== a.payload);
        toast.success("Product deleted");
      });
  },
});

export default productSlice.reducer;
