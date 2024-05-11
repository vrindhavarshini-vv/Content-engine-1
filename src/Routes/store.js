import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slices/adminLogin";
<<<<<<< HEAD
import SettingSlice from "./Slices/settingsLogin";
=======

import SettingSlice from "./Slices/settingsLogin";



import templateSlice from "./Slices/templateSlice";
import  DashBoardSlice  from "./Slices/dashBoardSlice";
>>>>>>> 551d34955461fe940db66823063e299404061fb5


export default configureStore({
  reducer: {
    adminLogin: AdminLogin,
<<<<<<< HEAD
    settings:SettingSlice
=======
    settings:SettingSlice,
    template: templateSlice,
    dashboardslice:DashBoardSlice

>>>>>>> 551d34955461fe940db66823063e299404061fb5
  },
});
