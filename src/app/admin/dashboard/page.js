"use client"
import AdminDashboard from "@/app/components/adminDashboard";
import { app } from "@/app/_private/firebaseConfig";
import { getFirestore,getDocs,collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import BasicLoader from "@/app/components/basicLoader";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
export default function Dashboard(){
    const [isLoading,setIsloading]=useState(false)
    const [PlacedOrdersTotal,setPlacedOrdersTotal]=useState(0)
    const [TotalofFulfilledOrders,setTotalFUllFiledOrders]=useState(0)
    const [deliveryCharges,setTotalDeliveryCharges]=useState(0)
    const [totalProfit,setTotalProfit]=useState(0)
    const [checkoutTotal,setCheckoutTotal]=useState(0)
    const db=getFirestore(app)
    const router=useRouter()
    const loginState=useSelector(data=>data.userData)
    const getPlacedOrderstotal=async()=>{
        const docRef=collection(db,"placedOrders")
        try{
        let ordersData=await getDocs(docRef)
        const data = ordersData.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          if(data.length === 0){
            setPlacedOrdersTotal(0)
            return
          }
        let Placedtotal=data.reduce((acc,it)=>{
            return acc+parseInt(it["postingPrice"])
        },0)  
        setPlacedOrdersTotal(Placedtotal)
    }catch(err){
        toast.error("unable to update data...")
        setPlacedOrdersTotal(0)
        console.log(err)
        return
    }
}

    const getTotalOfFullfilOrders=async()=>{
        const docRef=collection(db,"fulfilledOrders")
        try{
        let ordersData=await getDocs(docRef)
        const data = ordersData.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          if(data.length === 0){
            setTotalFUllFiledOrders(0)
            return
          }
        let Fulfiledtotal=data.reduce((acc,it)=>{
            return acc+parseInt(it["postingPrice"])
        },0)  
        setTotalFUllFiledOrders(Fulfiledtotal)
    }catch(err){
        toast.error("unable to update data...")
        setTotalFUllFiledOrders(0)
        console.log(err)
        return
    }
    }
    let totalActualPrice=async()=>{
        const docRef=collection(db,"fulfilledOrders")
        try{
        let ordersData=await getDocs(docRef)
        const data = ordersData.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          if(data.length === 0){
            setTotalProfit(0)
            return
          }
        let ActualOrdersTotal=data.reduce((acc,it)=>{
            return acc+parseInt(it["Total"])
        },0)  
       setTotalProfit(ActualOrdersTotal)
    }catch(err){
        toast.error("unable to update data...")
        console.log(err)
        setTotalProfit(0)
    }
    }
    let getTotalDeliveryCharges=async()=>{
        const docRef=collection(db,"fulfilledOrders")
        try{
        let ordersData=await getDocs(docRef)
        const data = ordersData.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const chargesRef=doc(db,"Delivery","info")
          let DeliverChargesInfo=await getDoc(chargesRef)
          if(DeliverChargesInfo.exists()){
            setTotalDeliveryCharges(data.length * parseInt(DeliverChargesInfo.data().Charges))
          }else{
            toast.error("Error Getting delivery information")
            console.log("info does n't exists")
            setTotalDeliveryCharges(0)
            return
          }
        }catch(error){
        toast.error("unable to update data...")
        console.log(err)
        setTotalDeliveryCharges(0) 
         return
        }
    }
    const getGetTotalPayedAmount=async()=>{
        try{
        const checkouts=collection(db,"checkouts")
        let checkoutsData=await getDocs(checkouts)
        let checks=checkoutsData.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))

          let totalCheckouts=checks.reduce((acc,it)=>{
            return acc + parseInt(it["TotalAmount"])
          },0)
          console.log(totalCheckouts)
          if(totalCheckouts > 0){
            setCheckoutTotal(totalCheckouts)
          }else{
            setCheckoutTotal(0)
          }}catch(error){
            setCheckoutTotal(0)
            toast.error("Error  getting total payed Amount")
            return
          }

    }
  

    useEffect(()=>{
        if(!loginState.login || !loginState.isAdmin){
            router.replace("/login")
        }
        async function getData(){
            setIsloading(true)
            await Promise.all([getPlacedOrderstotal(),getTotalOfFullfilOrders(),getTotalDeliveryCharges(),totalActualPrice(),getGetTotalPayedAmount()])
            
            setIsloading(false)
        }
        getData()
    },[])
    return(
        <>
        {
            isLoading ? <BasicLoader/> : 
        <AdminDashboard 
        placedOrdersTotal={PlacedOrdersTotal}
        fulfilledOrdersTotal={TotalofFulfilledOrders}
        TotalDeliveryCharges={deliveryCharges}
        totalProfitEarned={totalProfit}
        checkOutsTotal={checkoutTotal}

        />
        }
        </>
    )
}