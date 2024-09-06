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
   <>
   <section class="py-24 relative ">
        <div class="w-full max-w-7xl p-5 md:px-5 lg-6 mx-auto border-2">

            <h2 class="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">Shopping Cart
            </h2>
            <div class="hidden lg:grid grid-cols-2 py-6">
                <div class="font-normal text-xl leading-8 text-gray-500">Product</div>
                <p class="font-normal text-xl leading-8 text-gray-500 md:ml-[4rem] flex items-center justify-between">
                    {/* <span class="w-full max-w-[200px] text-center">Delivery Charge</span> */}
                    <span class="w-full max-w-[260px] text-center">Quantity</span>
                    <span class="w-full max-w-[200px] text-center">Total</span>
                </p>
            </div>
          {/* Add max-height and scroll */}
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
       <div class="bg-gray-50 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto">
                <div class="flex items-center justify-between w-full mb-6">
                    <p class="font-normal text-xl leading-8 text-gray-400">Sub Total</p>
                    <h6 class="font-semibold text-xl leading-8 text-gray-900">Rs {Subtotal > 0 ? Subtotal : "00"}/-</h6>
                </div>
                <div class="flex items-center justify-between w-full pb-6 border-b border-gray-200">
                    <p class="font-normal text-xl leading-8 text-gray-400">Delivery Charge</p>
                    <h6 class="font-semibold text-xl leading-8 text-gray-900">Rs {delivery}/-</h6>
                </div>
                <div class="flex items-center justify-between w-full py-6">
                    <p class="font-manrope font-medium text-2xl leading-9 text-gray-900">Total</p>
                    <h6 class="font-manrope font-medium text-2xl leading-9 text-emerald-500">Rs {cartTotal > 0 ? cartTotal : "00"}/-</h6>
                </div>
            </div>
            <div class="flex items-center flex-col sm:flex-row justify-center gap-3 mt-8">
               
                <button
                    class="rounded-full w-full max-w-[280px] py-4 text-center justify-center items-center bg-emerald-600 font-semibold text-lg text-white flex transition-all duration-500 hover:bg-emerald-700"
                    onClick={Checkout}
                    >Checkout
                    <svg class="ml-2" xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22"
                        fill="none">
                        <path d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998" stroke="white" stroke-width="1.6"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
  </>
}

        </>
    )
}
