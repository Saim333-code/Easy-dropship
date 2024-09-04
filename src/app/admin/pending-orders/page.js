"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getDoc,doc,getFirestore,collection, getDocs } from "firebase/firestore"
import { app } from "@/app/_private/firebaseConfig"
import { addItems } from "@/app/statemanagement/slices/orderItems"
import { useSelector,useDispatch } from "react-redux"
import OrdersCardAdmin from "@/app/components/adminPendinOrders"
import UserTable from "@/app/components/adminPendingOrdersTable"
import BasicLoader from "@/app/components/basicLoader"
export default function PendingOrdersAdmin(){
const db=getFirestore(app);
const loginState=useSelector((data)=>data.userData)
const [isLoading,setIsloading]=useState(false)
const router=useRouter();
const [Orders,setOrders]=useState([])
const dispatch=useDispatch();
useEffect(()=>{
    setIsloading(true)
    if(!loginState.login || !loginState.isAdmin){
        router.replace("/login")
        return
    }
    async function getData(){
        if(!loginState.login || !loginState.isAdmin ){
            router.replace("/login")
            return
        }
        const docRef=collection(db,"pendingOrders")
        const querySnapshot = await getDocs(docRef);
        const ordersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        console.log(ordersList)
        setOrders(ordersList)
    setIsloading(false)

    }
    getData();
},[])
    return(
        <>
        <h1 class="text-5xl font-extrabold dark:text-white text-center my-6 underline">Pending Orders</h1>
        <div className="flex flex-col-reverse my-2 gap-5 items-center justify-center min-h-screen">
        
        {
        isLoading ? <BasicLoader/> : 
    <UserTable users={Orders}/>
        }
        </div>
        </>
    )
}