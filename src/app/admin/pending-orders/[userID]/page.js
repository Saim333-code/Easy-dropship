"use client"
import NOdatacard from "@/app/components/noDatacard"
import { app } from "@/app/_private/firebaseConfig"
import { addItems } from "@/app/statemanagement/slices/orderItems"
import { getDoc,doc,getFirestore } from "firebase/firestore"
import { useSelector,useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OrdersCardAdmin from "@/app/components/adminPendinOrders"
import BasicLoader from "@/app/components/basicLoader"
export default function UserOrders({params}){
const id=decodeURIComponent(params.userID);
const db=getFirestore(app);
const loginState=useSelector((data)=>data.userData)
const [pendingOrders,setPendingOrders]=useState([]);
const [isLoading,setIsloading]=useState(false)
const router=useRouter()
const dispatch=useDispatch()

useEffect(()=>{
    setIsloading(true)
    if(!loginState.login || !loginState.isAdmin){
        router.replace("/login")
        return
    }
    async function getData(){
        if(!loginState.login || !loginState.isAdmin){
            router.replace("/login")
            return
        }
        const docRef=doc(db,"pendingOrders",`${id}`)
        const ordersData=await getDoc(docRef)
        if(ordersData.exists()){
            setPendingOrders(ordersData.data().orders);
            let data=ordersData.data().orders;
            for(let item of data){
                item.time=item.time.toDate().toLocaleString()
            }
            dispatch(addItems(data))
            setIsloading(false)
        }else{
            setPendingOrders([]);
            dispatch(addItems([]))
            setIsloading(false)
        }
    }
    getData();
},[])


    return(
        <>
          <h1 class="text-5xl font-extrabold dark:text-white text-center my-6 underline">Pending Orders</h1>
        <div className="flex flex-col-reverse my-2 gap-5 items-center justify-center min-h-screen">
        
        {
            isLoading ? <BasicLoader/> :
         (
            pendingOrders.length > 0 ? 
        pendingOrders.map((e)=>{
            return(
        <OrdersCardAdmin key={e.ID}   
          ID={e.ID}
        customerName={e.customerName}
        customerEmail={e.customerEmail}
        time={e.time}
        postingPrice={e.postingPrice}
        product={e}
        shipperEmail={id}
        />
             )
    }) : <NOdatacard text="NO orders to show"/>
)
        }
        
        </div>
        </>
    )
}