"use client"

import { useState } from "react";
import { addUser } from "../statemanagement/slices/userSlice";
//we use useDipatch hook to send data to or store
import {useDispatch} from "react-redux"
export default function Authentication() {

const [user,setUser]=useState("");
const disptach=useDispatch();

let handleChange=(e)=>{
setUser(e);
console.log(e)
disptach(addUser(user));
}
    return (
        <>
          <p className="w-screen bg-black text-center text-white">Authentication page</p>

          <input type="text" className="bg-red-500 border-white" onKeyPress={(e)=>(handleChange(e.target.value))}/>
  
        </>
    );
  }