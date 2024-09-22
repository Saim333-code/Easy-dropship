"use client"
import Image from "next/image";
import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addProduct } from "../statemanagement/slices/order";
import { toast } from "react-toastify";
import { addCartItem } from "../statemanagement/slices/cart";
import { getFirestore,doc,updateDoc } from "firebase/firestore";
import { app } from "../_private/firebaseConfig";
export default function ProductCard(props){
 const {
    src1, 
    src2,
    src3,
    src4,
    name,
    description,
    vendor,
    price,
    cutoffPrice,
    id
    
}  =props;
const [mainImage, setMainImage] = useState(src1);
const login=useSelector((data)=>data.userData)
const cartState=useSelector((data)=>data.cart)
const [quantity,setQuantity]=useState(1);
const router=useRouter();
const dispatch=useDispatch();
const db=getFirestore(app)

const incrementQuantity=()=>{
    setQuantity(prev=>prev+1);
}
const decrementQuantity=()=>{
    
    if(quantity === 1 || quantity < 1 ){
        setQuantity(1)
    }else{
        setQuantity(prev=>prev-1)
    }
}
const changeImage = (src) => {
    setMainImage(src);
  };

const addTocart=()=>{
    if(!login.login){
        toast.error("Please login to add items to cart")
        return
        }
        // console.log(cartState)
        let isInCart=false
        for(const item of cartState){
            
            if(item.productId === id){
                isInCart=true;
                break
            }
        }
        if(isInCart === true){
            toast.error("Item is already in the cart");
            return
        }

        const dispatchData={
            productName:name,
            productId:id,
            quantity:1,
            price:price,
            imageSrc:src1,
            vendor:vendor
        }
        dispatch(addCartItem(JSON.stringify(dispatchData)))
        toast.success("Added to cart")
        let addedTocart=false;
        for(let item of cartState){
            if(item.productId === id){
                addedTocart=true;
                break
            }else{
                addedTocart=false
            }
        }
        try{
        if(addedTocart === true){
            const userDocRef = doc(db, "verifiedUsers", `${login.Email}`);
            
            updateDoc(userDocRef,{
                cart:cartState
            })
            return
        }else{
        const userDocRef = doc(db, "verifiedUsers", `${login.Email}`);
            let updatedState=JSON.parse(JSON.stringify(cartState))
            updatedState.push(dispatchData)
            updateDoc(userDocRef,{
                cart:updatedState
            })
        }
    }catch(err){
        toast.error("Error adding item to cart")
    }
        

        console.log("addedtoCart: ",addedTocart)
        console.log("cart: ",cartState)
}

const handleQuantityChange=(e)=>{
    console.log(e.target.value)
    if(e.target.value && parseInt(e.target.value) > 0){
    setQuantity(parseInt(e.target.value))
    }else{
        setQuantity(1) 
    }
}

const shopNow=()=>{
    if(login.login === false){
        window.location.replace("/login")
        // router.replace("/login")
    }
    if(parseInt(quantity) === 0){
        toast.error("Please inerease quantity")
        return
    }
    const orderData={
        productId:id,
        productName:name,
        price,
        imageSrc:src1,
        quantity:quantity,
        vendor
    }
    dispatch(addProduct(JSON.stringify(orderData)));
    router.replace("/checkout/productchekout")
    console.log(orderData)
}

    return(
        <>
        <div className='overflow-x-hidden'>
        <div className="m-8 bg-gray-50 border rounded-2xl py-5">
          <div className="container mx-auto ">
            <div className="flex flex-col md:flex-row  -mx-12 space-x-4">
              {/* Product Images */}
              <div className="w-full md:w-1/2 px-4 mb-8" >
                <Image
                  src={mainImage}
                  alt="Product"
                  className="md:w-[88%] max-h-[52%] md:ml-[5rem] h-auto rounded-lg shadow-md mb-4"
                  id="mainImage"
                  height={600}
                  width={600}
                />  
                <div className="flex gap-4 py-4 justify-center overflow-x-auto md:ml-[5rem]">
                  <Image
                    src={src1}
                    alt="Thumbnail 1"
                    height={600}
                  width={600}
                    className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                    onClick={() => changeImage(src1)}
                  />
                  <Image
                    src={src2}
                    alt="Thumbnail 2"
                    height={600}
                  width={600}
                    className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                    onClick={() => changeImage(src2)}
                  />
                  <Image
                    src={src3}
                    alt="Thumbnail 3"
                    height={600}
                  width={600}
                    className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                    onClick={() => changeImage(src3)}
                  />
                  <Image
                    src={src4}
                    alt="Thumbnail 4"
                    height={600}
                  width={600}
                    className="size-16 sm:size-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300"
                    onClick={() => changeImage(src4)}
                  />
                </div>
              </div>
    
              {/* Product Details */}
              <div className="w-full p-[3rem] md:p-0 md:w-[44%] md:px-2 text-xl tracking-wide">
                <h2 className="text-3xl font-bold mb-2">{name}</h2>
                <p className="text-gray-800 mb-4 font-semibold">Vendor: {vendor}</p>
                <div className="mb-4">
                  <span className="text-2xl text-emerald-500 font-bold mr-2">Rs {price}/-</span>
                  <span className="text-gray-500 line-through">Rs {cutoffPrice}/-</span>
                </div>
                <div className="flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-emerald-500">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 ml-2">4.9 </span>
                </div>
                <div className="flex items-center mb-6">
                <label htmlFor="quantity" className="text-black font-bold mr-2">Quantity:</label>
                
                <div className="flex items-center">
                  {/* Minus Button */}
                  <button 
                    className="p-2"
                    onClick={decrementQuantity}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16px" 
                      height="9.737px" 
                      viewBox="0 0 122.881 9.737" 
                      fill="currentColor"
                      className="text-emerald-500"
                    >
                      <path d="M117.922,0.006C117.951,0.002,117.982,0,118.012,0c0.656,0,1.285,0.132,1.861,0.371c0.014,0.005,0.025,0.011,0.037,0.017 c0.584,0.248,1.107,0.603,1.543,1.039c0.881,0.88,1.428,2.098,1.428,3.441c0,0.654-0.133,1.283-0.371,1.859 c-0.248,0.6-0.609,1.137-1.057,1.583c-0.445,0.445-0.98,0.806-1.58,1.055v0.001c-0.576,0.238-1.205,0.37-1.861,0.37 c-0.029,0-0.061-0.002-0.09-0.006c-37.654,0-75.309,0.001-112.964,0.001c-0.029,0.004-0.059,0.006-0.09,0.006 c-0.654,0-1.283-0.132-1.859-0.371c-0.6-0.248-1.137-0.609-1.583-1.056C0.981,7.865,0.621,7.33,0.372,6.73H0.371 C0.132,6.154,0,5.525,0,4.869C0,4.215,0.132,3.586,0.371,3.01c0.249-0.6,0.61-1.137,1.056-1.583 c0.881-0.881,2.098-1.426,3.442-1.426c0.031,0,0.061,0.002,0.09,0.006C42.613,0.006,80.268,0.006,117.922,0.006L117.922,0.006z"/>
                    </svg>
                  </button>
                  
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
    
                  {/* Plus Button */}
                  <button 
                    className="p-2"
                    onClick={incrementQuantity}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16px" 
                      height="16px" 
                      viewBox="0 0 122.881 122.88" 
                      fill="currentColor"
                      className="text-emerald-500"
                    >
                      <path d="M56.573,4.868c0-0.655,0.132-1.283,0.37-1.859c0.249-0.6,0.61-1.137,1.056-1.583C58.879,0.545,60.097,0,61.44,0 c0.658,0,1.287,0.132,1.863,0.371c0.012,0.005,0.023,0.011,0.037,0.017c0.584,0.248,1.107,0.603,1.543,1.039 c0.881,0.88,1.426,2.098,1.426,3.442c0,0.03-0.002,0.06-0.006,0.089v51.62l51.619,0c0.029-0.003,0.061-0.006,0.09-0.006 c0.656,0,1.285,0.132,1.861,0.371c0.014,0.005,0.025,0.011,0.037,0.017c0.584,0.248,1.107,0.603,1.543,1.039 c0.881,0.88,1.428,2.098,1.428,3.441c0,0.654-0.133,1.283-0.371,1.859c-0.248,0.6-0.609,1.137-1.057,1.583 c-0.445,0.445-0.98,0.806-1.58,1.055v0.001c-0.576,0.238-1.205,0.37-1.861,0.37c-0.029,0-0.061-0.002-0.09-0.006l-51.619,0.001 v51.619c0.004,0.029,0.006,0.06,0.006,0.09c0,0.656-0.133,1.286-0.371,1.861c-0.006,0.014-0.012,0.025-0.018,0.037 c-0.248,0.584-0.602,1.107-1.037,1.543c-0.883,0.882-2.1,1.427-3.443,1.427c-0.654,0-1.283-0.132-1.859-0.371 c-0.6-0.248-1.137-0.609-1.583-1.056c-0.445-0.444-0.806-0.98-1.055-1.58h-0.001c-0.239-0.575-0.371-1.205-0.371-1.861 c0-0.03,0.002-0.061,0.006-0.09V66.303H4.958c-0.029,0.004-0.059,0.006-0.09,0.006c-0.654,0-1.283-0.132-1.859-0.371 c-0.6-0.248-1.137-0.609-1.583-1.056c-0.445-0.445-0.806-0.98-1.055-1.58H0.371C0.132,62.726,0,62.097,0,61.44 c0-0.655,0.132-1.283,0.371-1.859c0.249-0.6,0.61-1.137,1.056-1.583c0.881-0.881,2.098-1.426,3.442-1.426 c0.031,0,0.061,0.002,0.09,0.006l51.62,0l0-51.62C56.575,4.928,56.573,4.898,56.573,4.868L56.573,4.868z"/>
                    </svg>
                  </button>
                </div>
              </div>
    
    
                <div className='flex  flex-row md:flex-row justify-normal md:space-x-2'>
                <button className="w-[45%] bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition duration-300 text-base leading-tight" onClick={addTocart}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 122.43 122.88"
                  fill="currentColor"
                  className="inline-block w-5 h-5 mr-2"
                >
                  <g>
                    <path
                      className="fill-current mr-[0.5rem]"
                      d="M22.63,12.6h93.3c6.1,0,5.77,2.47,5.24,8.77l-3.47,44.23c-0.59,7.05-0.09,5.34-7.56,6.41l-68.62,8.73l3.63,10.53c29.77,0,44.16,0,73.91,0c1,3.74,2.36,9.83,3.36,14h-12.28l-1.18-4.26c-24.8,0-34.25,0-59.06,0c-13.55-0.23-12.19,3.44-15.44-8.27L11.18,8.11H0V0h19.61C20.52,3.41,21.78,9.15,22.63,12.6L22.63,12.6z M53.69,103.92c5.23,0,9.48,4.25,9.48,9.48c0,5.24-4.24,9.48-9.48,9.48c-5.24,0-9.48-4.24-9.48-9.48C44.21,108.17,48.45,103.92,53.69,103.92L53.69,103.92z M92.79,103.92c5.23,0,9.48,4.25,9.48,9.48c0,5.24-4.25,9.48-9.48,9.48c-5.24,0-9.48-4.24-9.48-9.48C83.31,108.17,87.55,103.92,92.79,103.92L92.79,103.92z M30.8,43.07H45.9l-5.48-22.91c-5.4,0-10.72-0.01-15.93-0.01l1.84,6.86L26.39,27L30.8,43.07L30.8,43.07L30.8,43.07z M48.31,20.17l5.48,22.9h14.54l-5.5-22.88L48.31,20.17L48.31,20.17L48.31,20.17z M70.74,20.2l5.5,22.87h13.91l-5.48-22.85L70.74,20.2L70.74,20.2L70.74,20.2z M92.58,20.23l5.48,22.85l13.92,0l1.54-18.36c0.43-5.12,1.33-4.47-3.63-4.47C104.23,20.24,98.44,20.23,92.58,20.23L92.58,20.23L92.58,20.23z M111.49,48.89H99.45l3.97,16.56l0.98-0.13c6.07-0.87,5.67,0.52,6.15-5.21L111.49,48.89L111.49,48.89z M95.77,66.5l-4.22-17.61h-13.9l4.67,19.44L95.77,66.5L95.77,66.5L95.77,66.5z M74.66,69.37l-4.93-20.49l-14.55,0l5.37,22.41L74.66,69.37L74.66,69.37L74.66,69.37z M52.9,72.34l-5.61-23.45H32.4l6.96,25.3L52.9,72.34L52.9,72.34z"
                    />
                  </g>
                </svg>
                Add to Cart
              </button>
    
    
                <button className="w-[45%] bg-gray-100 text-black px-4 py-2 rounded-md hover:bg-gray-200  transition duration-300 mt-0 text-base leading-tight flex items-center justify-center space-x-2" onClick={shopNow}>
                <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 122.88 94.91"
                  className="w-6 h-6">
                  <path d="M54.58,74.69a1.43,1.43,0 110 2.86 1.43 1.43 0 010-2.86zm57.55-72.22c0 .04 9.28 31.27 10.33 33.73.29.47.43.96.43 1.45 0 3.36-4 3.5-6.3 3.5v51.92c0 1.02-.83 1.85-1.85 1.85H8.17c-1.02 0-1.85-.83-1.85-1.85V41.13C3.98 41.13 0 41 0 37.64c0-.49.13-.98.43-1.45L10.46 2.98C11.49 1.4 11.8 0 14.13 0h94.61c2.02 0 2.66 1.17 3.39 2.47zm.75 38.66H10.01v50.08h36.9V57.66c0-2.19.9-4.18 2.34-5.62 1.5-1.5 3.51-2.34 5.63-2.34h13.15c2.19 0 4.18.9 5.62 2.34a7.938 7.938 0 012.34 5.62v33.55h36.9V41.13h-.01zM68.01 53.4H54.87c-1.17 0-2.24.48-3.01 1.25-.77.77-1.25 1.84-1.25 3.01v33.55h21.67V57.66c0-1.17-.48-2.24-1.25-3.01a4.26 4.26 0 00-3.02-1.25zm17.21 2.39h13.17c1.02 0 1.85.83 1.85 1.85V77.2c0 1.02-.83 1.85-1.85 1.85H85.22c-1.02 0-1.85-.83-1.85-1.85V57.64c0-1.02.82-1.85 1.85-1.85zm11.31 3.7h-9.47v15.86h9.48l-.01-15.86zm-72.02-3.7h13.17c1.02 0 1.85.83 1.85 1.85V77.2c0 1.02-.83 1.85-1.85 1.85H24.51c-1.02 0-1.85-.83-1.85-1.85V57.64c0-1.02.82-1.85 1.85-1.85zm11.31 3.7h-9.47v15.86h9.48l-.01-15.86zM24.64 24.85l5.23-.33c.11.85.34 1.49.69 1.94.57.72 1.38 1.08 2.43 1.08.78 0 1.39-.18 1.81-.55.43-.37.64-.8.64-1.28 0-.46-.2-.88-.6-1.24s-1.34-.71-2.82-1.03c-2.42-.54-4.14-1.26-5.17-2.16-1.04-.9-1.56-2.04-1.56-3.44 0-.91.27-1.78.8-2.59.53-.82 1.33-1.46 2.4-1.92 1.07-.46 2.53-.7 4.38-.7 2.28 0 4.02.42 5.21 1.28 1.2.85 1.91 2.2 2.13 4.05l-5.18.31c-.14-.81-.43-1.4-.87-1.77-.44-.37-1.05-.55-1.83-.55-.64 0-1.13.14-1.45.41-.32.27-.49.6-.49.99 0 .28.13.54.39.76.25.24.87.45 1.84.66 2.41.52 4.13 1.05 5.17 1.58s1.8 1.19 2.28 1.98c.47.78.71 1.67.71 2.64 0 1.14-.32 2.2-.95 3.16-.64.96-1.52 1.7-2.65 2.2-1.13.5-2.56.75-4.29.75-3.03 0-5.13-.59-6.3-1.75-1.14-1.2-1.8-2.69-1.95-4.48zm18.33-11.94h5.51v6.23h6.03v-6.23h5.53v17.84H54.5v-7.23h-6.03v7.23h-5.51V12.91h.01zm19.39 8.93c0-2.91.81-5.18 2.43-6.8s3.88-2.43 6.78-2.43c2.97 0 5.26.8 6.86 2.39 1.61 1.59 2.41 3.83 2.41 6.7 0 2.09-.35 3.79-1.05 5.13s-1.72 2.37-3.04 3.11c-1.33.74-2.98 1.11-4.96 1.11-2.01 0-3.68-.32-5-.96-1.32-.64-2.39-1.66-3.21-3.04-.81-1.39-1.22-3.13-1.22-5.21zm5.51.01c0 1.8.34 3.1 1.01 3.88.67.78 1.59 1.18 2.74 1.18 1.18 0 2.11-.39 2.75-1.15.65-.77.98-2.15.98-4.15 0-1.68-.34-2.9-1.02-3.67-.68-.78-1.6-1.16-2.76-1.16-1.11 0-2.01.4-2.68 1.18-.68.77-1.02 2.08-1.02 3.89zm15.28-8.94h9.17c2 0 3.5.48 4.49 1.43.99.95 1.49 2.3 1.49 4.06 0 1.8-.55 3.21-1.63 4.23-1.08 1.01-2.75 1.52-4.97 1.52h-3.02v6.6h-5.53V12.91zm5.53 7.62h1.36c1.07 0 1.83-.19 2.25-.56.43-.37.65-.84.65-1.42 0-.56-.19-1.03-.56-1.42-.37-.39-1.08-.58-2.12-.58h-1.58v3.98z"
                  fillRule="evenodd" clipRule="evenodd" 
                  className='mr-[0.5rem]'
                />
                </svg>
                <span>Shop Now</span>
                </button>
                </div>
                {/* {Description} */}
                <div className='my-6'>
                <h1 className='font-bold'>Description:</h1>
                <p className="text-gray-600 mb-4 text-justify text-wrap w-[90%]">
                  {description}
                </p>
                </div>
    
               
             
              </div>
            </div>
          </div>
        </div>
        </div>
        </>
    );

}