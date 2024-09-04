import { configureStore } from "@reduxjs/toolkit"
import userSliceReducer from "./slices/userSlice"
import orderReducer from "./slices/order"
import cartReducer from "./slices/cart"
import orderItems from "./slices/orderItems"
//when we have multiple reducers we use combine reducers

export const store=configureStore({
    reducer:{
        userData:userSliceReducer,
        order:orderReducer,
        cart:cartReducer,
        orderedItems:orderItems
    }
})