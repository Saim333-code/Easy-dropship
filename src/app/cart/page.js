"use client"
//set updelivery charges
import Cartpage from "../components/cart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NOdatacard from "../components/noDatacard";
import { useRouter } from "next/navigation";
import { app } from "../_private/firebaseConfig";
import { getFirestore,doc,getDoc, getDocs, updateDoc } from "firebase/firestore";
import BasicLoader from "../components/basicLoader";
import  { addMultipleItems } from "../statemanagement/slices/cart";
import { toast } from "react-toastify";
export default function Cart(){
    let cartState=useSelector((data)=>data.cart)
    let loginState=useSelector((state)=>state.userData)
    const router=useRouter();
    let [Subtotal,setSubtotal]=useState(0);
    let [cartTotal,setCartTotal]=useState(0)
    const [isLoading,setIslaoding]=useState(false)
    const [delivery,setDelivery]=useState(0)
    const db=getFirestore(app)
    const dispatch=useDispatch()
    const getDataFromCart=async()=>{
      console.log("in cart js")
      const docRef=doc(db,"verifiedUsers",`${loginState.Email}`);
      const cartData=await getDoc(docRef)
      if(cartData.exists()){
        dispatch(addMultipleItems(JSON.stringify(cartData.data().cart)))
        console.log(JSON.stringify(cartData.data().cart))
        // setIslaoding(false)
      }else{
        dispatch(addMultipleItems(JSON.stringify([])))
        // setIslaoding(false)
      }
    }
    const removeIT=async(keys)=>{
    
      let DocRef=doc(db,"verifiedUsers",`${loginState.Email}`)
      let oldCart=await getDoc(DocRef);
      if(oldCart.exists()){
        let cartItems=oldCart.data().cart
        console.log(cartItems)
        let NewState=cartItems.filter((item)=>{
         return item.productId !== keys
        })
        console.log(NewState)
        try{
          await updateDoc(DocRef,{
            cart:NewState
          })
        }catch(error){
          toast.error("Error Removing from cart")
          console.log(error)
        }
      }else{
        return
      }
      
    }

    const getDelivery=async()=>{
      setIslaoding(true)
      const DocRef=doc(db,"Delivery","info")
      let deliveryDocs=await getDoc(DocRef);
      if(deliveryDocs.exists()){
      console.log(deliveryDocs.data().Charges)
        setDelivery(parseInt(deliveryDocs.data().Charges))
      }else{
        toast.error("Unable to get delivery charges")
        setDelivery(250)     
      }
    }
        let updateTotal=()=>{
          let price=0;
          for (let item of cartState){
            let itemPrice=parseInt(item.quantity) * parseInt(item.price);
            price+=itemPrice;

          }
          setSubtotal(price)
          setCartTotal(price+parseInt(delivery));

        }
    
        const Checkout=()=>{
          console.log(cartState)
          router.push("/checkout/cartCheckout")

        }

       
      
        useEffect(()=>{
          updateTotal();
          console.log("cartState:: ",cartState)
        },[cartState])
        useEffect(()=>{
          setIslaoding(true)
          if(!loginState.login){
            router.replace("/login")
          }
          async function getData() {
            await Promise.all([getDelivery(),getDataFromCart()])
            setIslaoding(false)
          }
          getData()
        },[loginState.Email])
    return(
        <>
   {isLoading ? <BasicLoader/> : 
  <div className="h-screen bg-gray-100 pt-20 mb-5 overflow-y-hidden">
    <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
    <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
      <div className="rounded-lg md:w-2/3">
        <div className="max-h-[30rem] overflow-y-auto"> {/* Add max-height and scroll */}
          {
            cartState.length !== 0 ?
              cartState.map((e) => {
                return (
                  <Cartpage
                    key={e.productId}
                    keys={e.productId}
                    name={e.productName}
                    quantity={e.quantity}
                    src={e.imageSrc}
                    price={e.price}
                    vendor={e.vendor}
                    removeFunc={removeIT}
                  />
                )
              }) :
              <NOdatacard text="Nothing in cart"/>
          }
        </div>
      </div>
      <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
        <div className="mb-2 flex justify-between">
          <p className="text-gray-700">Subtotal</p>
          <p className="text-gray-700">RS {Subtotal > 0 ? Subtotal : "00"}/-</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700">Delivery</p>
          <p className="text-gray-700">Rs {delivery}/-</p>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between">
          <p className="text-lg font-bold">Total</p>
          <div className="">
            <p className="mb-1 text-lg font-bold">RS {cartTotal > 0 ? cartTotal : "00"}/-</p>
            <p className="text-sm text-gray-700">including VAT</p>
          </div>
        </div>
        <button className="mt-6 w-full rounded-md bg-emerald-500 py-1.5 font-medium text-white hover:bg-emerald-600" onClick={Checkout}>Check out</button>
      </div>
    </div>
  </div>
}

        </>
    )
}
