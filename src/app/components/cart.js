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
//     <>
// <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
// <Image
//  src={src} alt="product-image" className="w-full rounded-lg sm:w-40" width={200} height={100} />
// <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
//   <div className="mt-5 sm:mt-0">
//     <h2 className="text-lg font-bold text-gray-900">{name}</h2>
//     <p className="mt-1 text-xs text-gray-700">{vendor}</p>
//   </div>
//   <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
//     <div className="flex items-center border-gray-100">
//       <span className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50" onClick={decrementQuantity}> - </span>
//       <input className="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" value={quantity} min="1" onChange={(e)=>changeHandle(e)}/>
//       <span className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50" onClick={increaseQuantity}> + </span>
//     </div>
//     <div className="flex items-center space-x-4">
//       <p className="text-xs">RS {Price}/-</p>
//         <p onClick={removefromCart}>
//       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//       </svg>
//       </p>
//     </div>
//   </div>
// </div>
// </div>
    // </>
    <>
     
    
    <div class="grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-6 border-t border-gray-200 py-6">
                <div
                    class="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full max-xl:justify-center max-xl:max-w-xl max-xl:mx-auto">
                    <div class="img-box"><img src={src} alt="perfume bottle image" class="xl:w-[140px] rounded-xl"/></div>
                    <div class="pro-data w-full max-w-sm ">
                        <h5 class="font-semibold text-xl leading-8 text-black max-[550px]:text-center">{name}
                        </h5>
                        <p
                            class="font-normal text-lg leading-8 text-gray-500 my-2 min-[550px]:my-3 max-[550px]:text-center">
                            {vendor}</p>
                            <p onClick={removefromCart}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          </p>

                        {/* <h6 class="font-medium text-lg leading-8 text-emerald-600  max-[550px]:text-center">{price}</h6> */}
                    </div>
                </div>
                <div
                    class="flex items-center flex-col min-[550px]:flex-row w-full max-xl:max-w-xl max-xl:mx-auto gap-2">
                    {/* <h6 class="font-manrope font-bold text-2xl leading-9 text-black w-full max-w-[176px] text-center">
                        $15.00 <span class="text-sm text-gray-300 ml-3 lg:hidden whitespace-nowrap">(Delivery
                            Charge)</span></h6> */}
                    <div class="flex items-center w-full mx-auto justify-center">
                        <button
                            class="group rounded-l-full px-6 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            onClick={decrementQuantity}
                            >
                            <svg class="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
                                fill="none">
                                <path d="M16.5 11H5.5" stroke="" stroke-width="1.6" strokeLinecap="round" />
                                <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                    strokeLinecap="round" />
                                <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                    strokeLinecap="round" />
                            </svg>
                        </button>
                        <input type="text"
                            class="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[118px] min-w-[80px] placeholder:text-gray-900 py-[15px] text-center bg-transparent"
                            placeholder="1" onChange={(e)=>changeHandle(e)}
                            value={quantity}
                            />
                        <button
                            class="group rounded-r-full px-6 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            onClick={increaseQuantity}
                            >
                            <svg class="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
                                fill="none">
                                <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-width="1.6"
                                    strokeLinecap="round" />
                                <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                    strokeLinecap="round" />
                                <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                    strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <h6
                        class="text-emerald-600 font-manrope font-bold text-2xl leading-9 w-full max-w-[176px] text-center">
                        Rs {price}/-</h6>
                </div>
            </div>
    
    
    </>
)
}