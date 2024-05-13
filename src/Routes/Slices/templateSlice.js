import { createSlice } from "@reduxjs/toolkit";

export const TemplateSlice = createSlice({
  name: "template",
  initialState: {
    fbCategory: [],
    selectedCategory: null,
    fbType: [],
    fbGeneratedDatas:[],
    categoryAndTypes:[]

  },
  reducers: {
    setFbCategory: (state, action) => {
      state.fbCategory = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setFbType: (state, action) => {
      state.fbType = action.payload;
    },
    setFbGeneratedDatas:(state,action)=>{
      state.fbGeneratedDatas=action.payload
    },
    setCategoryAndTypes:(state,action)=>{
      state.categoryAndTypes = action.payload
    }
  },
});
export const { setFbCategory, setSelectedCategory, setFbType,setCategoryAndTypes,setFbGeneratedDatas } =
  TemplateSlice.actions;
export default TemplateSlice.reducer;
