import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; 

// ================= FETCH ACTIVITY LOGS =================
export const fetchActivityLogs = createAsyncThunk(
  "activityLogs/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/admin/activity-logs");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to load activity logs"
      );
    }
  }
);

const activityLogSlice = createSlice({
  name: "activityLogs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default activityLogSlice.reducer;
