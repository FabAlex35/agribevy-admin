"use client"
import { configureStore } from "@reduxjs/toolkit";
import Slice from "./features/Slice";
 const store=configureStore({
    reducer:{
        user:Slice
    }
})

export default store