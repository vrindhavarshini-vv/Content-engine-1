import { createSlice } from "@reduxjs/toolkit";


export const AdminLogin = createSlice({
  name: "adminLogin",
  initialState: {
    adminLoginData: {},
    adminLogged: false,
    isAdmin: false,
    userStatus:"Requested",
    userDetails:([]),
    superAdminLogged:false
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
    setUserStatus: (state, action) => {
      state.userStatus = action.payload;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setSuperAdminLogged: (state, action) => {
      state.superAdminLogged = action.payload;
    }
  },
});

export const { setAdminLoginData, setAdminLogged, setIsAdmin , setUserStatus,setUserDetails,setSuperAdminLogged} =
  AdminLogin.actions;
export default AdminLogin.reducer;
