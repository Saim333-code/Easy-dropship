const { createSlice } = require("@reduxjs/toolkit");

const slice=createSlice({
    name:"orders slice",
    initialState:{
        products:[],
    },
    reducers:{
        addProduct:(state,action)=>{
            const orderItem={}

            orderItem["productName"]=JSON.parse(action.payload).productName
            orderItem["productId"]=JSON.parse(action.payload).productId
            orderItem["quantity"]=JSON.parse(action.payload).quantity
            orderItem["price"]=JSON.parse(action.payload).price
            orderItem["imageSrc"]=JSON.parse(action.payload).imageSrc
            orderItem["vendor"]=JSON.parse(action.payload).vendor
            state.products[0]=orderItem
        }
    }
    })
export const{addProduct}=slice.actions;
export default slice.reducer;