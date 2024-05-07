import { createSlice } from "@reduxjs/toolkit";

export const TemplateSlice = createSlice(
    {
        name:'template',
        initialState:{
            fbCategory:[],
            selectedCategory:null,
            fbType:[]
        },
        reducers:{
            setFbCategory:(state,action)=>{
                state.fbCategory = action.payload
            },
            setSelectedCategory:(state,action)=>{
                state.selectedCategory = action.payload
            },
            setFbType:(state,action)=>{
                state.fbType = action.payload
            }
        }
    }
)
export const {setFbCategory,setSelectedCategory,setFbType} = TemplateSlice.actions
export default TemplateSlice.reducer
