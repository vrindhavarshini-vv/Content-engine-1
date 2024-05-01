import { createSlice } from "@reduxjs/toolkit";

export const AdminLogin = createSlice({
  name: "adminLogin",
  initialState: {
    adminLoginData: {},
    adminLogged: false,
  },
  reducers: {
    setAdminLoginData: (state, action) => {
      state.adminLoginData = action.payload;
    },
    setAdminLogged: (state, action) => {
      state.adminLogged = action.payload;
    },
  },
});

export const { setAdminLoginData, setAdminLogged } = AdminLogin.actions;
export default AdminLogin.reducer;
