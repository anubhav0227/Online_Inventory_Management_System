import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


let fakeCategories = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Groceries" },
];

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    return fakeCategories;
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (name) => {
    const newCategory = { id: Date.now(), name };
    fakeCategories.push(newCategory);
    return newCategory;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, name }) => {
    fakeCategories = fakeCategories.map((c) => (c.id === id ? { ...c, name } : c));
    return { id, name };
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id) => {
    fakeCategories = fakeCategories.filter((c) => c.id !== id);
    return id;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (s) => { s.loading = true; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchCategories.rejected, (s, a) => { s.loading = false; s.error = a.error; })

      .addCase(addCategory.fulfilled, (s, a) => { s.list.push(a.payload); })

      .addCase(updateCategory.fulfilled, (s, a) => {
        s.list = s.list.map((c) => (c.id === a.payload.id ? { ...c, name: a.payload.name } : c));
      })

      .addCase(deleteCategory.fulfilled, (s, a) => {
        s.list = s.list.filter((c) => c.id !== a.payload);
      });
  },
});

export default categorySlice.reducer;
