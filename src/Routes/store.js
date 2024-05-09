import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slices/adminLogin";
<<<<<<< HEAD
import SettingSlice from "./Slices/settingsLogin";
=======
import templateSlice from "./Slices/templateSlice";
>>>>>>> 51e6957adb71e9ad740b8387a2b0b991f7fdf49f

export default configureStore({
  reducer: {
    adminLogin: AdminLogin,
<<<<<<< HEAD
    settings:SettingSlice
=======
    template: templateSlice,
>>>>>>> 51e6957adb71e9ad740b8387a2b0b991f7fdf49f
  },
});
