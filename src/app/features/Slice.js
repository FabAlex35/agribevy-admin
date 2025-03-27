"use client"
import { createSlice } from "@reduxjs/toolkit";

const Slice=createSlice({
    name:"myslice",
    initialState:{
        nameChanged:false,
        userDetails:null
    },
    reducers:{
        changeName:(state,action)=>{
            state.nameChanged=action.payload
        },
        getUserDetailsSlice:(state,action)=>{
            state.userDetails=action.payload
        }
    }
})

export const {changeName,getUserDetailsSlice}= Slice.actions
export default Slice.reducer