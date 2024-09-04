"use client"
import NOdatacard from "@/app/components/noDatacard";
import Usercard from "@/app/components/userCard";
import axios from "axios"
import { useEffect, useState } from "react";
import BasicLoader from "@/app/components/basicLoader";
// async function getUserData(userId) {

//     let response=await axios.get("http://localhost:3000/apis/getUser",{
//         params: { id: userId }
//     });
//     return response.data;
// }


export default function Admin({params}){
    const [data,setData]=useState({})
    const [isLoading,setIsLoading]=useState(false)

    // const data= await getUserData(params.user)
    useEffect(()=>{
        console.log(data.Result)
        setIsLoading(false)
    },[data])
 useEffect(()=>{
    async function getUserData() {
        setIsLoading(true)
        let response=await axios.get("/apis/getUser",{
            params: { id: params.user}
        });
        console.log(response.data.Result)
        setData(response.data.Result)
    }
    getUserData()
 },[])
    return(
        <>
        {isLoading ?<BasicLoader/> : 
        <Usercard params={data} id={params.user}/>
    }
        </>
    )

}