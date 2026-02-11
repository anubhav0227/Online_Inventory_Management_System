import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import companyReducer from "./slices/companySlice";
import salesReducer from "./slices/salesSlice";
import purchaseReducer from "./slices/purchaseSlice";
import productReducer from "./slices/productSlice";
import activityLogsReducer from "./slices/activityLogSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    companies: companyReducer,
    sales: salesReducer,
    purchases: purchaseReducer,
    products: productReducer,
    activityLogs: activityLogsReducer,
  },
});

export default store;
