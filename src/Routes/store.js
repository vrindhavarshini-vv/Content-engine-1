import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slices/adminLogin";
import templateSlice from "./Slices/templateSlice";

export default configureStore({
  reducer: {
    adminLogin: AdminLogin,
    template: templateSlice,
  },
});
