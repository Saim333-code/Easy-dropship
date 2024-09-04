"use client"

import { useEffect,useState } from "react"
import { useSelector } from "react-redux"
import Ordersum3 from "@/app/components/orderSummary"
export default function OrderInfo({params}){
let OrderedState=useSelector((data)=>data.orderedItems)
const [orderItem,setOrderItem]=useState({})

useEffect(()=>{
    console.log(OrderedState)

    const orderdItem=OrderedState.filter((item)=>{
        return item.ID === parseInt(params.orderid) 
    })
    setOrderItem(orderdItem[0])
},[OrderedState])
return(
        <>
        <Ordersum3
        item={orderItem}
        />
        </>
    )
}