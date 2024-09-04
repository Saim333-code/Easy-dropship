const { createSlice } = require("@reduxjs/toolkit");

const cart=createSlice({
    name:"userCart",
    initialState:[],
    reducers:{
        addCartItem:(state,action)=>{
            const cartItem={};
            cartItem["productName"]=JSON.parse(action.payload).productName
            cartItem["productId"]=JSON.parse(action.payload).productId
            cartItem["quantity"]=JSON.parse(action.payload).quantity
            cartItem["price"]=JSON.parse(action.payload).price
            cartItem["imageSrc"]=JSON.parse(action.payload).imageSrc
            cartItem["vendor"]=JSON.parse(action.payload).vendor
            state.push(cartItem)
            
    },
    removeFromcart:(state,action)=>{
       return state.filter((e)=>e.productId !== action.payload);
    },
    increaseItemsQuantity:(state,action)=>{
        const {keys,updatedquantity}=action.payload;
       console.log(keys,updatedquantity)
       return state.map((item)=>{
        if(item.productId === keys){
            return {
                ...item,
                quantity:updatedquantity
            }
        }
        return item
       })
    
    },
    addMultipleItems:(state,action)=>{
       return JSON.parse(action.payload)
       
    }
    }

})

export const{addCartItem,removeFromcart,increaseItemsQuantity,addMultipleItems}=cart.actions

export default cart.reducer