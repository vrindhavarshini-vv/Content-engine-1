import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slice/adminLogin";
import UserRegister from "./Slice/UserRegister";

export default configureStore({
  reducer: {
    adminLogin: AdminLogin,
    register: UserRegister,
  },
});
