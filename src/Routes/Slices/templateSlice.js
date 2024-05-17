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
      // console.log('acPay',state.fbType)
      const categoryTypes =state.fbCategory.map((category) => {
        const typesForCategory = state.fbType.filter((type) => type.categoryId === category.categoryId).map((doc) => doc.type);
        console.log('tyCat',typesForCategory)
        return { category, types: typesForCategory };
      });
      state.categoryAndTypes = categoryTypes

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
