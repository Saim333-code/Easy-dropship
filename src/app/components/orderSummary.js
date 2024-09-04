"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDoc,doc,updateDoc,getFirestore,deleteDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { app } from "../_private/firebaseConfig";
import BasicLoader from "./basicLoader";
import NOdatacard from "./noDatacard";

const Ordersum3 = (props) => {
    const router=useRouter();
const {ID,time,postingAddress,customerEmail,customerMobile,postingName,customerName,zip,city,postingState,postingPrice,Total,status,Items}=props.item || ""

const loginState=useSelector((data)=>data.userData)
const [DeliveryPrice,setDeliveryPrice]=useState(0)
const [isLoading,setIsloading]=useState(false)
const db=getFirestore(app)
const hasUnsavedChanges = true;

const DeleteOrder=async()=>{
    try{
        let pendingOrder=await getDoc(doc(db,"pendingOrders",`${loginState.Email}`))
        let ordersData=pendingOrder.data().orders
        let updatedOrders=ordersData.filter((item)=>{
            return item.ID !== ID
        })
        if(updatedOrders.length === 0){
            try{
            await deleteDoc(doc(db,"pendingOrders",`${loginState.Email}`))
            toast.success("Order Deleted")
            router.replace("/orders")
            return
        }catch(error){
            console.log("adminOrdersummary/52",error)
            router.replace("/orders")
            return
        }
        }
        await updateDoc(doc(db,"pendingOrders",`${loginState.Email}`),{
            orders:updatedOrders
        })
        router.replace("/orders")
        toast.success("Order deleted")
        return
    }catch(error){
        toast.error("Error deleting order please try again")
        return 
        }
}
useEffect(()=>{
   
if(!loginState.login){
router.replace('/login')
}

    async function getDeliveryPrice(){
        setIsloading(true)
        const docRef=doc(db,"Delivery","info")
        let DeliveryData=await getDoc(docRef)
        if(DeliveryData.exists()){
          setDeliveryPrice(parseInt(DeliveryData.data().Charges))
          setIsloading(false)
          return
        }else{
          setDeliveryPrice(250)
          setIsloading(false)
          return
        }
      }
      getDeliveryPrice()


},[])
useEffect(() => {
    const handleBeforeUnload = (event) => {
        // router.push("/orders")
        // return
      if (hasUnsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        event.preventDefault();
        event.returnValue = message; // Standard way to set the message
        return message; // For some older browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

return (
    <>

    {
    
    isLoading ? <BasicLoader/> : 
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
            <div className="flex justify-start item-start space-y-2 flex-col ">
                <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">Order #{ID}</h1>
                <p className="text-base font-medium leading-6 text-gray-600">{time}</p>
            </div>
            <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                        <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">Customer’s Cart</p>
                        {
                          Items && Items.map((e)=>{
                                return(
                           <div className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full " key={e.productId}>
                            <div className="pb-4 md:pb-8 w-full md:w-40">
                                <Image className="w-full hidden md:block" src={e.imageSrc} alt="product image" height={500} width={500} />
                                
                            </div>
                            <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                <div className="w-full flex flex-col justify-start items-start space-y-8">
                                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">{e.productName}</h3>
                                    <div className="flex justify-start items-start flex-col space-y-2">
                                        <p className="text-sm leading-none text-gray-800">
                                            <span className="text-gray-300">Vendor: </span>   {e.vendor}
                                        </p>
                                        
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-8 items-start w-full">
                                    <p className="text-base xl:text-lg leading-6">
                                        Rs {e.price}/-
                                    </p>
                                    <p className="text-base xl:text-lg leading-6 text-gray-800">{e.quantity}</p>
                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">Rs {parseInt(e.price) * parseInt(e.quantity)}/-</p>
                                </div>
                            </div>
                        </div>
    )})   
                    }



                    </div>
                    <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
                            <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200  pb-4">
                                <div className="flex justify-between border-b pb-4 w-full">
                                    <p className="text-base leading-4 text-gray-800">Dropshipper Price</p>
                                    <p className="text-base leading-4 text-gray-600">Rs {postingPrice}/-</p>
                                </div>
                               
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base leading-4 text-gray-800">Shipping</p>
                                    <p className="text-base leading-4 text-gray-600">Rs {DeliveryPrice}/-</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b pb-4 w-full">
                            <p className="text-base leading-4 text-gray-800">Total</p>
                            <p className="text-base leading-4 text-gray-600">Rs {Total}/-</p>
                            </div>

                            <div className="flex justify-between items-center w-full">
                                <p className="text-base font-semibold leading-4 text-gray-800">Grand Total</p>
                                <p className="text-base font-semibold leading-4 text-gray-600">Rs {parseInt(Total) + DeliveryPrice}/-</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Status</h3>
                          
                            <div className="w-full flex justify-center items-center">
                                <button className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">{status}</button>
                            </div>
                            <div className="w-full flex justify-center items-center">
                                <button className="hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 py-5 w-96 md:w-full bg-red-600 text-base font-medium leading-4 text-white" onClick={DeleteOrder}>Delete Order</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                    <h3 className="text-xl font-semibold leading-5 text-gray-800">Customer</h3>
                    <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                           

                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4  border-gray-200 w-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{customerEmail}</p>
                            </div>

                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.62 10.79C8.06 13.71 10.29 15.94 13.21 17.38L15 15.59C15.16 15.42 15.39 15.36 15.6 15.41C16.67 15.67 17.8 15.83 18.99 15.83C19.55 15.83 20 16.28 20 16.84V20C20 20.55 19.55 21 19 21C9.61 21 3 14.39 3 5C3 4.45 3.45 4 4 4H7.16C7.72 4 8.17 4.45 8.17 5.01C8.17 6.2 8.33 7.33 8.59 8.4C8.64 8.61 8.58 8.84 8.41 9L6.62 10.79Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{customerMobile}</p>
                            </div>
                        </div>
                        <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 xl:mt-8">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{postingAddress}</p>
                                </div>
                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 ">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Customer Name</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{customerName}</p>
                                </div>
                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 ">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Dropshipper posting  Name</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{postingName}</p>
                                </div>

                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 ">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">City/state/zip</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{city}/{postingState}/{zip}</p>
                                </div>

        
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        }
        </>
    );
};

export default Ordersum3;
