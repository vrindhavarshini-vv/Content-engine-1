import { createSlice } from "@reduxjs/toolkit";

export const TemplateSlice = createSlice({
  name: "template",
  initialState: {
    fbCategory: [],
    selectedCategory: null,
    fbType: [],
    fbGeneratedDatas:[],
    categoryAndTypes:[],
    

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
      const categoryTypes =state.fbCategory.map((category) => {
        const typesForCategory = action.payload
          .filter((type) => type.categoryId === category.categoryId)
          .map((doc) => doc.type);
        return { category, types: typesForCategory };
      });
      state.categoryAndTypes = categoryTypes.slice()

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
