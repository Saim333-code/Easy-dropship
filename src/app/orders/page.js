"use client"
import OrdersCard from "../components/ordersCard"
import SubNavbar from "../components/subnavbar"
import NOdatacard from "../components/noDatacard"
import { app } from "../_private/firebaseConfig"
import { addItems } from "../statemanagement/slices/orderItems"
import { getDoc,doc,getFirestore } from "firebase/firestore"
import { useSelector,useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BasicLoader from "../components/basicLoader"
export default function Orders(){
    const db=getFirestore(app);
    const loginState=useSelector((data)=>data.userData)
    const [pendingOrders,setPendingOrders]=useState([]);
    const [isLoading,setIsloading]=useState(false)
    const router=useRouter()
    const dispatch=useDispatch()

    useEffect(()=>{
        if(!loginState.login){
            router.replace("/")
            return
        }
        async function getData(){
            setIsloading(true)
            if(!loginState.login){
                router.replace("/")
                return
            }
            const docRef=doc(db,"pendingOrders",`${loginState.Email}`)
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
        {isLoading ? <BasicLoader/> : 
        <>
        <SubNavbar/>
        <h1 className="text-5xl font-extrabold dark:text-white text-center mt-6 mb-2 border">Pending Orders</h1>
        <div className="flex flex-col-reverse my-2 gap-5 items-center justify-center min-h-screen">
        
        {
            pendingOrders.length > 0 ? 
        pendingOrders.map((e)=>{
            return(
        <OrdersCard key={e.ID}   
          ID={e.ID}
        customerName={e.customerName}
        customerEmail={e.customerEmail}
        time={e.time}
        postingPrice={e.postingPrice}
        product={e}
        />
             )
    }) : <NOdatacard text="NO orders to show"/>
        }
        </div>
        </>
        }
        </>
    )
}
/*
{
    "Total": 123000,
    "postingAddress": "CPO 1/16 MR III NRC E-8 ISLAMABAD",
    "customerEmail": "muhammadsd442@gmail.com",
    "customerMobile": "03102527452",
    "postingName": "Eflare",
    "ID": 1723809494733,
    "customerName": "Muhammad Saad",
    "zip": "04408",
    "postingPrice": "5550",
    "time": {
        "seconds": 1723809494,
        "nanoseconds": 733000000
    },
    "city": "ISLAMABAD",
    "Items": [
        {
            "productId": "MgyNtg82TWreHxkWUUyM",
            "productName": "3D caof madnessmera with nature capturing and ulitimatum ",
            "vendor": "Eflare",
            "price": "35000",
            "imageSrc": "https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/3D%20caof%20madnessmera%20with%20nature%20capturing%20and%20ulitimatum%20-productsPageimage?alt=media&token=98482937-7ace-44ab-aebf-a1ce1464e0a6",
            "quantity": 1
        },
        {
            "quantity": 2,
            "productId": "Essqd7ubiIneRPmOLzfG",
            "imageSrc": "https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/test%20product%20-productsPageimage?alt=media&token=00917459-a2ab-45ac-bb79-014fb5568804",
            "productName": "test product ",
            "vendor": "eflare",
            "price": "35000"
        },
        {
            "vendor": "aquafina",
            "productId": "CVWgN7uz8DwXbOBocdUI",
            "imageSrc": "https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/wlight%20water%20bottle-productsPageimage?alt=media&token=3dbba53f-2fe8-48ef-94e2-bb7aa78136b9",
            "productName": "wlight water bottle",
            "price": "9000",
            "quantity": 2
        }
    ],
    "shipperEmail": "verifieduser2@gmail.com",
    "postingState": "ISLAMABAD",
    "status": "pending"
}
*/