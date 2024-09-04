import {createSlice,nanoId} from "@reduxjs/toolkit"
//createslice to create a slice 
//nanoid is used to give uniquer id to array elements
const userSlice=createSlice({
    name:"Users Data Slice",
    initialState:{
        login:false,
        Email:undefined,
        uID:undefined,
        isAdmin:false
    },
    reducers:{
        addUser:(state,action)=>{
            //state : current State
            //action : inputted data by user
            
            const{Email,uID,login,isAdmin}=JSON.parse(action.payload)
            state["Email"]=Email
            state["uID"]=uID
            state["login"]=login
            state["isAdmin"]=isAdmin
            // console.log("state: ",action.payload)
        }
    }
})

export const {addUser}=userSlice.actions;
export default userSlice.reducer;