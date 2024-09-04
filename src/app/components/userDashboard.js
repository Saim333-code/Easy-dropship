"use client";
import { useEffect, useState } from "react";
import { app } from "../_private/firebaseConfig";
import { getFirestore,doc,getDoc,updateDoc,Timestamp,arrayUnion } from "firebase/firestore";
import { useSelector } from "react-redux";
import BasicLoader from "./basicLoader";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function UserDashboard() {
const [pendingOrdersTotal,setpendingOrdersTotal]=useState(0)
const [placedOrdersTotal,setPlacedOrdersTotal]=useState(0)
const [fulffiledOrdersTotal,setFullfillOrders]=useState(0);
const [securityFee,setSecurityFee]=useState(0)
const [isLoading,setIsLoading]=useState(true)
const [checkoutAmount,setCheckoutAmount]=useState(0)
const [withDrawedAmount,setWithDrawedAmount]=useState(0)
const loginState=useSelector(data=>data.userData)
const router=useRouter()
const db=getFirestore(app)

const [isDialogOpen, setIsDialogOpen] = useState(false);
const openDialog = () => setIsDialogOpen(true);
const closeDialog = () => setIsDialogOpen(false);

const handleCheckout = async() => {
  await getFullfilledordersTotal();
  const docRef=doc(db,"checkoutRequests","RequestedCheckouts");
  if(checkoutAmount <= 0 || checkoutAmount > fulffiledOrdersTotal){
    toast.error("Invalid amount or Amount is less than your fulfilled orders")
    setCheckoutAmount(0)
    closeDialog();
    return
  }
  const DataTopost={
    Email:`${loginState.Email}`,
    CurrentBalance:fulffiledOrdersTotal,
    Amount:checkoutAmount,
    Date:Timestamp.now()
  }
  try{
  await updateDoc(docRef,{
    Requests:arrayUnion(DataTopost)
  })
  closeDialog();
  toast.success("Your request is posted you will get a confirmation soon")
}catch(error){
  toast.error("Error making your checkout request.please try again later")
  console.log(error)
  closeDialog();
}
};
const getSecurityFee=async()=>{
const docRef=doc(db,"verifiedUsers",`${loginState.Email}`)
const userData=await getDoc(docRef)
if(userData.exists()){
    const securityFees=userData.data().Security
    setSecurityFee(parseInt(securityFees))
}else{
    setSecurityFee(0)
}
}

const getPendingOrdersTotal=async()=>{
const docRef=doc(db,"pendingOrders",`${loginState.Email}`)
const deliveryRef=doc(db,"Delivery","info")
let deliveryCharges=0;
const deliveryInfo=await getDoc(deliveryRef)
if(deliveryInfo.exists()){
    deliveryCharges=parseInt(deliveryInfo.data().Charges)
}
const userData=await getDoc(docRef)
if(userData.exists()){
const data=userData.data().orders
let total=data.reduce((ac,item)=>{
return ac + parseInt(item.Total)
},0)
let shipperTotal=data.reduce((ac,item)=>{
    return ac + parseInt(item.postingPrice)
    },0)
console.log("pending orders total")
let totalDelivery=deliveryCharges*(data.length)
let TotalPendingProfit=(shipperTotal - total)-totalDelivery
setpendingOrdersTotal(TotalPendingProfit)
}else{
    setpendingOrdersTotal(0)
}
}


const getPlacedOrdersTotal=async()=>{
    const docRef=doc(db,"usersPlacedOrders",`${loginState.Email}`)
    const deliveryRef=doc(db,"Delivery","info")
    let deliveryCharges=0;
    const deliveryInfo=await getDoc(deliveryRef)
    if(deliveryInfo.exists()){
        deliveryCharges=parseInt(deliveryInfo.data().Charges)
    }
    const userData=await getDoc(docRef)
    if(userData.exists()){
    const data=userData.data().placedOrders
    let total=data.reduce((ac,item)=>{
    return ac + parseInt(item.Total)
    },0)
    let shipperTotal=data.reduce((ac,item)=>{
    return ac + parseInt(item.postingPrice)
    },0)
    console.log("placed orders total")
    let totalDelivery=deliveryCharges*(data.length)
    let TotalPlacedProfit=(shipperTotal - total)-totalDelivery
    setPlacedOrdersTotal(TotalPlacedProfit)
}else{
    setPlacedOrdersTotal(0)
}
}

const getFullfilledordersTotal=async()=>{

    const docRef=doc(db,"userFulfilledOrders",`${loginState.Email}`)
    const deliveryRef=doc(db,"Delivery","info")
    const userCheckOuts=doc(db,"checkouts",`${loginState.Email}`)
    let deliveryCharges=0;
    let userOlderChekout=0;
    
    const deliveryInfo=await getDoc(deliveryRef)
    if(deliveryInfo.exists()){
        deliveryCharges=parseInt(deliveryInfo.data().Charges)
    }
    let userTotalCheckouts=await getDoc(userCheckOuts);
    if(userTotalCheckouts.exists()){
        userOlderChekout=parseInt(userTotalCheckouts.data().TotalAmount)
        console.log("check1")
    }
    const userData=await getDoc(docRef)
    if(userData.exists()){
        const data=userData.data().FulfilledOrders
        let total=data.reduce((acc,it)=>{
            return acc+parseInt(it.Total)
        },0)
        let shipperTotal=data.reduce((acc,it)=>{
            return acc+parseInt(it.postingPrice)
        },0)
        let totalDelivery=deliveryCharges*(data.length)
        let totalProfit=0;
      if(shipperTotal > (total+totalDelivery+userOlderChekout)){
         totalProfit=((shipperTotal-total)-totalDelivery)-userOlderChekout;
      }else{
        totalProfit=0
      }
        console.log("fuifilled orders profit")
        console.log(totalProfit)
        setFullfillOrders(totalProfit)
    }else{
        setFullfillOrders(0)
    }

}
const getWithdraw=async()=>{
  const docRef=doc(db,"checkouts",`${loginState.Email}`)
  let userData=await getDoc(docRef)
  if(userData.exists()){
    setWithDrawedAmount(parseInt(userData.data().TotalAmount))
  }else{
    setWithDrawedAmount(0)
  }
}

useEffect(()=>{
  async function getData() {
    setIsLoading(true)
    await Promise.all([getSecurityFee(),getPendingOrdersTotal(),getPlacedOrdersTotal(),getFullfilledordersTotal(),getWithdraw()])
    setIsLoading(false)
}

getData();
},[loginState.login])


useEffect(()=>{
  if(!loginState.login && !localStorage.getItem("ADS")){
    router.replace("/login")
  }
},[])


  return (
    <>
    {
        isLoading ? <BasicLoader/> : (
          <div className="relative bg-gray-50 py-16 pt-32">
          {/* Checkout Button */}
          <button
            className="absolute top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-emerald-600 transition duration-300"
            onClick={openDialog}
          >
            Withdraw 
          </button>
        
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Easy Dropshipping Users Payment Statistics
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:mt-6">
                Following are your payment details
              </p>
            </div>
          </div>
          <div className="mt-12 pb-6">
  <div className="relative">
    <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="flex flex-col border-b border-gray-200 p-6 text-center sm:border-0 sm:border-r">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Total of Pending Orders
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
              Rs {pendingOrdersTotal}/-
            </dd>
          </div>
          <div className="flex flex-col border-t border-b border-gray-200 p-6 text-center sm:border-0 sm:border-l sm:border-r">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Total of Placed Orders
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
              Rs {placedOrdersTotal}/-
            </dd>
          </div>
          <div className="flex flex-col border-t border-gray-200 p-6 text-center sm:border-0 sm:border-l">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Total of Fulfilled Orders
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
              Rs {fulffiledOrdersTotal}/-
            </dd>
          </div>
          <div className="flex flex-col border-b border-gray-200 p-6 text-center sm:border-0 sm:border-l sm:col-span-3">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Total Withdrawed Amount
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
              Rs {withDrawedAmount}/-
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</div>

        
          {/* New Box Below */}
          <div className="mt-12 max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Rs {securityFee}/-
              </h3>
              <p className="text-gray-700">Your Security Fee</p>
            </div>
          </div>
        
          {/* Disclaimer Line */}
          <div className="w-full bg-emerald-500 py-3 text-center mt-5">
            <p className="text-white text-sm">
              Disclaimer: All information is subject to change.
            </p>
          </div>
        
            {isDialogOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-72">
                <h3 className="text-lg font-bold mb-4">Checkout</h3>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="border p-2 mb-4 w-full"
                  onChange={(e)=>{
                   if(e.target.value && (parseInt(e.target.value) > 0)){
                     setCheckoutAmount(parseInt(e.target.value))
                   }else{
                     setCheckoutAmount(0)
                   }
                  }}
                />
                <div className="flex justify-end">
                  <button
                    className="bg-gray-200 px-4 py-2 mr-2 rounded"
                    onClick={closeDialog}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-emerald-500 text-white px-4 py-2 rounded"
                    onClick={handleCheckout}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>   
     ) 
     }  
     </div>
  )
}
    </>
  );
}
