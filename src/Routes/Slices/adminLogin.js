import { createSlice } from "@reduxjs/toolkit";

export const AdminLogin = createSlice({
  name: "adminLogin",
  initialState: {
    
    adminLoginData: {},
    adminLogged: false,
    isAdmin: false
  },
  reducers: {
    
    setAdminLoginData: (state, action) => {
      state.adminLoginData = action.payload;
    },
    setAdminLogged: (state, action) => {
      state.adminLogged = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

export const { setAdminLoginData, setAdminLogged, setIsAdmin } =
  AdminLogin.actions;
export default AdminLogin.reducer;
