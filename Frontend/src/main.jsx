import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./stores/store";
import "./index.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <>
      <BrowserRouter>
        <App />
      </BrowserRouter>

      {/* Keep Toaster OUTSIDE router to avoid Fiber crash */}
      <Toaster position="top-right" />
    </>
  </Provider>
);
