import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slices/adminLogin";

export default configureStore({
  reducer: {
    adminLogin: AdminLogin
  },
});
