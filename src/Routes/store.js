import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slices/adminLogin";
import SettingSlice from "./Slices/settingsLogin";


export default configureStore({
  reducer: {
    adminLogin: AdminLogin,
    settings:SettingSlice
  },
});
