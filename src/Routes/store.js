import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slices/adminLogin";
import templateSlice from "./Slices/templateSlice";
import  DashBoardSlice  from "./Slices/dashBoardSlice";

export default configureStore({
  reducer: {
    adminLogin: AdminLogin,
    template: templateSlice,
    dashboardslice:DashBoardSlice
  },
});
