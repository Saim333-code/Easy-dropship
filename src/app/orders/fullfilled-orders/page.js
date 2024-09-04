"use client"

import FulfilledOrders from "@/app/components/fulfilorders";
import BasicLoader from "@/app/components/basicLoader";
import { useEffect, useState } from "react";
import { doc,getDoc,getFirestore, updateDoc } from "firebase/firestore";
import { app } from "@/app/_private/firebaseConfig";
import { useSelector } from "react-redux";
import NOdatacard from "@/app/components/noDatacard";
import { useRouter } from "next/navigation";
export default function Fulfilled(){
    const [isLoading,setIsLoading]=useState(true)
    const [fulfilledOrders,setFulfilledOrders]=useState([])
    const db=getFirestore(app)
    const loginState=useSelector(data => data.userData)
    const router=useRouter();

    const delOrder=async(id)=>{
        setIsLoading(true)
        const docRef=doc(db,"userFulfilledOrders",`${loginState.Email}`)
        let updateOrders=fulfilledOrders.filter((order)=>{
            return order.ID !== id
        })
        await updateDoc(docRef,{
            FulfilledOrders:updateOrders
        })
        setFulfilledOrders(updateOrders)
        setIsLoading(false)
    }
    useEffect(()=>{
        async function getData() {
            const docRef = doc(db,"userFulfilledOrders",`${loginState.Email}`)
            let fulfilledOrders=await getDoc(docRef)
            if(fulfilledOrders.exists()){
            let data=fulfilledOrders.data().FulfilledOrders
            setFulfilledOrders(data)
            setIsLoading(false)
            } else{
                setFulfilledOrders([])
            }
        
        }
        getData()
    },[loginState.Email,loginState])

    useEffect(()=>{
        if(!loginState.login){
            router.replace("/")
        }
    },[])
    return(
        <>
        <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Fulfilled Orders</h1>
      <div className="space-y-6">
        {
            isLoading ? <BasicLoader/> :
           ( fulfilledOrders.length > 0 ?
            fulfilledOrders.map((e)=>{
                return (
            <FulfilledOrders
            key={e.ID}
            order={e}
            delOrder={delOrder}
            />
        )
        })
        :
            <NOdatacard text="No orders to show"/>
            )
        }
        </div>
        </div>
        </>
    )
}