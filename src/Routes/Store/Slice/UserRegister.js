import { createSlice } from "@reduxjs/toolkit";

export const UserRegister = createSlice({
  name: "register",
  initialState: {
    userRegisterData: {},
  },
  reducers: {
    setUserRegisterData: (state, action) => {
      state.userRegisterData = action.payload;
    },
  },
});

export const { setUserRegisterData } = UserRegister.actions;
export default UserRegister.reducer;
