import { createSlice } from "@reduxjs/toolkit";

const orderItems=createSlice({
name:"Order items",
initialState:[],

reducers:{
    addItems:(state,action)=>{
        return state=action.payload
    }
}
})

export const{addItems}=orderItems.actions;
export default orderItems.reducer