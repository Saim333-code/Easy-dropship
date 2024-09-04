"use client"
import Image from "next/image";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import cart, { addCartItem } from "../statemanagement/slices/cart";
import { getFirestore,doc,updateDoc } from "firebase/firestore";
import { app } from "../_private/firebaseConfig";


export default function Gallery(props){
    const {src,name,cutoutprice,orignalprice,dropshipper,id}=props;
    let CutPrice=Number.parseInt(cutoutprice)
    const alt='product.jpg'
    const loginState=useSelector((data)=>data.userData)
    const cartState=useSelector((data)=>data.cart)
    const dispatch=useDispatch();
    const db=getFirestore(app)


    const addTocart=async(event)=>{
        // console.log(id)
        event.stopPropagation();
        event.preventDefault();
        if(!loginState.login){
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
            price:orignalprice,
            imageSrc:src,
            vendor:dropshipper
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
            const userDocRef = doc(db, "verifiedUsers", `${loginState.Email}`);
            
            updateDoc(userDocRef,{
                cart:cartState
            })
            return
        }else{
        const userDocRef = doc(db, "verifiedUsers", `${loginState.Email}`);
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
    return(
        <>
        <section className="relative p-5 py-10 bg-white shadow-lg rounded-lg overflow-hidden group cursor-pointer">
        <div className="relative w-full h-64 mb-6">
          <Image 
            src={src} 
            alt={alt} 
            layout="fill" 
            objectFit="cover" 
            className="transition-transform duration-500 ease-in-out group-hover:scale-110" 
            loading="lazy"
          />
        </div>
        <div className="flex items-center justify-center space-x-1 mb-6">
          <svg className="w-5 h-5 fill-current text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z" />
          </svg>
          <svg className="w-5 h-5 fill-current text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z" />
          </svg>
          <svg className="w-5 h-5 fill-current text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z" />
          </svg>
          <svg className="w-5 h-5 fill-current text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
            <path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-3">{name}</h1>
        <p className="text-gray-700 mb-4 "><span className="font-bold">Vendor:</span> {dropshipper}</p>
        <h2 className="text-xl font-bold mb-4">
          <span className="text-green-600"> Rs {orignalprice}/-</span>
          <span className="line-through text-gray-500">Rs {CutPrice > 0 && CutPrice}/-</span> 
          
        </h2>
        <div className="flex justify-center gap-4">
          <button 
            className="px-4 py-2 bg-emerald-500  text-white rounded-md hover:bg-green-600 transition-colors duration-300" 
            onClick={(e) => addTocart(e)}
          >
            Add To Cart
          </button>
          <button 
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
          >
            Shop Now
          </button>
        </div>
      </section>
   </>
    );
}

