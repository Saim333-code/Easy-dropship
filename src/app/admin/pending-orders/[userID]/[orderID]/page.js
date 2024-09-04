"use client"

import OrdersumAdmin from "@/app/components/adminOrdersummary"
import { useEffect,useState } from "react"
import { useSelector } from "react-redux"
export default function ProductApprove({params}){
const orderItems=useSelector((data)=>data.orderedItems)
const [orderItem,setOrderItem]=useState({})


useEffect(()=>{
    const item=orderItems.filter((Product)=>{
        return Product.ID === parseInt(params.orderID)
    })
    setOrderItem(item[0])
},[orderItems])
    return(
        <>
        <OrdersumAdmin
        item={orderItem}/>
        </>
    )
}