import { createSlice } from "@reduxjs/toolkit";

export const TemplateSlice = createSlice({
  name: "template",
  initialState: {
    fbCategory: [],
    selectedCategory: null,
    fbType: [],
    fbGeneratedDatas: [],
    categoryAndTypes: [],
    categoryWithTypesWithTemplates:[],
    selectTemplate:'',
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
      const categoryTypes = state.fbCategory.map((category) => {
        const typesForCategory = state.fbType
          .filter((type) => type.categoryId === category.categoryId)
          .map((doc) => doc.type);
        return { category, types: typesForCategory };
      });
      state.categoryAndTypes = categoryTypes;
    },
    setFbGeneratedDatas: (state, action) => {
      state.fbGeneratedDatas = action.payload;
    },
    setCategoryAndTypes: (state, action) => {
      state.categoryAndTypes = action.payload;
        const cat = state.fbCategory.map((category) => {
          const typesForCategory = state.fbType
            .filter((type) => type.categoryId === category.categoryId)
            .map((type) => {
              const templatesForType = state.fbGeneratedDatas.filter(
                (data) => data.typeId === type.typeId
              );
              return {
                type: type.type,
                templates: templatesForType.map((template) => ({
                  id: template.id,
                  template: template.templates,
                })),
              };
            });
          return { category, types: typesForCategory };
        });
        state.categoryWithTypesWithTemplates = cat
      },
      setCategoryWithTypesWithTemplates:(state,action)=>{
        state.categoryWithTypesWithTemplates = action.payload
      },
      setSelectTemplate:(state,action)=>{
        state.selectTemplate = action.payload
      }
  },
});
export const {
  setFbCategory,
  setSelectedCategory,
  setFbType,
  setCategoryAndTypes,
  setFbGeneratedDatas,
  setCategoryWithTypesWithTemplates,
  setSelectTemplate
} = TemplateSlice.actions;
export default TemplateSlice.reducer;
