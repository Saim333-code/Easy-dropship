"use client"
import Link from "next/link"
import Image  from "next/image"
import { useEffect, useState} from "react"
import { useDispatch } from "react-redux"
import { removeFromcart } from "../statemanagement/slices/cart"
import { increaseItemsQuantity } from "../statemanagement/slices/cart"

export default function Cartpage(props){
    console.log("props: ",props)
    const {src,name,price,keys,vendor,removeFunc}=props;
    const [quantity,setQuantity]=useState(parseInt(1))
    const [Price, setPrice]=useState(parseInt(price));
    const dispatch=useDispatch();
    const increaseQuantity=(e)=>{
        setQuantity(prev=>prev+1);
    };
    const decrementQuantity=(e)=>{
        if(quantity <= 1){
            setQuantity(1)

            return
        }else{
            setQuantity((prev)=>prev-1)
            
            // Price=quantity*parseInt(price)
            
        }
    }
    const changeHandle=(e)=>{
        if(e.target.value){
            setQuantity(e.target.value)
            
        }else{
            setQuantity(1)
        }
    }
    const removefromCart=()=>{
        removeFunc(keys)
        dispatch(removeFromcart(keys));
    }
    useEffect(()=>{
        setPrice(quantity*parseInt(price))
        dispatch(increaseItemsQuantity({
          keys,
          updatedquantity:quantity
        }))
    },[quantity])
   
return(
    <>
<div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
<Image
 src={src} alt="product-image" className="w-full rounded-lg sm:w-40" width={200} height={100} />
<div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
  <div className="mt-5 sm:mt-0">
    <h2 className="text-lg font-bold text-gray-900">{name}</h2>
    <p className="mt-1 text-xs text-gray-700">{vendor}</p>
  </div>
  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
    <div className="flex items-center border-gray-100">
      <span className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50" onClick={decrementQuantity}> - </span>
      <input className="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" value={quantity} min="1" onChange={(e)=>changeHandle(e)}/>
      <span className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50" onClick={increaseQuantity}> + </span>
    </div>
    <div className="flex items-center space-x-4">
      <p className="text-xs">RS {Price}/-</p>
        <p onClick={removefromCart}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      </p>
    </div>
  </div>
</div>
</div>
    </>
)
}