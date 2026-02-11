import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================= SAFE LOAD USER =================
const loadUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    localStorage.removeItem("user");
    return null;
  }
};

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ username, password }, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      return res.data; // backend response
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Invalid username or password"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUser(),
    loading: false,
    error: null,
  },
  reducers: {
    // ===== LOGOUT =====
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
    },

    // ===== CLEAR ERROR =====
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ===== LOGIN PENDING =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ===== LOGIN SUCCESS =====
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        // ===== ROLE NORMALIZATION =====
        const role =
          payload.role ||
          payload.roles?.[0] ||
          payload.authorities?.[0] ||
          null;

        const user = {
          ...payload,
          role, // always ensure role exists
        };

        state.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      })

      // ===== LOGIN FAILED =====
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
