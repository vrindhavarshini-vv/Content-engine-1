import { createSlice } from "@reduxjs/toolkit";

export const DashBoardSlice = createSlice({
  name: "dashboardslice",
  initialState: {
   categoryList:[],
   typesList:[],
   selectedCategory:"",
   isCategorySelected:false,
   selectedType:"",
   isTypeSelected:false,
   selectedOption:"",
   isPopUp:false,
   categoryAndTypes:([]),
   answer:[],
   selectedCategoryName:"",
   selectedTypeName:"",
   templates:[]

   
   
  },
  reducers: {
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
    setTypesList: (state, action) => {
        state.typesList = action.payload;
      },
     
      setSelectedCategory: (state, action) => {
        state.selectedCategory = action.payload;
      },
      setIsCategorySelected: (state, action) => {
        state.isCategorySelected = action.payload;
      },
      setSelectedType: (state, action) => {
        state.selectedType = action.payload;
      },
      setIsTypeSelected: (state, action) => {
        state.isTypeSelected = action.payload;
      },
      setSelectedOption: (state, action) => {
        state.selectedOption = action.payload;
      },
      setIsPopUp: (state, action) => {
        state.isPopUp = action.payload;
      },
      setCategoryAndTypes: (state, action) => {
        state.categoryAndTypes = action.payload;
      },
      setAnswer:  (state, action) => {
        state.answer = action.payload;
      },
      setSelectedCategoryName:  (state, action) => {
        state.selectedCategoryName = action.payload;
      },
      setSelectedTypeName:  (state, action) => {
        state.selectedTypeName = action.payload;
      },
      addTemplates:  (state, action) => {
        state.templates = action.payload;
      },
    
  },
});

export const { setCategoryList,setTypesList,setSelectedCategory,setIsCategorySelected,setSelectedType,setIsTypeSelected,setSelectedOption,setIsPopUp,setCategoryAndTypes,setAnswer,setSelectedCategoryName,setSelectedTypeName,addTemplates} = DashBoardSlice.actions;
export default DashBoardSlice.reducer;