"use client"

import { useEffect, useState } from "react"
import { app } from "../_private/firebaseConfig"
import { getFirestore,getDoc,doc } from "firebase/firestore"
import { useSelector } from "react-redux"
import Image from "next/image"
import { useRouter } from "next/navigation"
import NOdatacard from "./noDatacard"
export default function PlacedOrders(){
    const [data,setData]=useState([])
    let loginState=useSelector((data)=>data.userData)
    const db=getFirestore(app)
    const cardWidth = 300; // Adjust based on your design
    const cardHeight = 200; // Adjust based on your design
    const router=useRouter();
      
    useEffect(()=>{
        console.log("placed orders running")
        async function getData() {
            let docRef=doc(db,"usersPlacedOrders",`${loginState.Email}`)
            let rawOrders= await getDoc(docRef);
            if(rawOrders.exists()){
                console.log(rawOrders.data().placedOrders)
                setData(rawOrders.data().placedOrders)
            }else{
                setData([]);
            }
             }
        getData();
    },[])
    useEffect(()=>{
        if(!loginState.login){
            router.replace("/login")
        }
    },[loginState])
    return(
        <>
        {
        data.length === 0  ?
         <NOdatacard text="no orders placed"/> :
        <div tabIndex="0" className="focus:outline-none">
           
            <div className="mx-auto container py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* {card item} */}
                    {
                        data.map((e)=>{
                            return(
                    <div tabIndex="0" key={e.ID} className="focus:outline-none w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300">
                        {/* <div>
                            <img alt="person capturing an image" src="https://cdn.tuk.dev/assets/templates/classified/Bitmap (1).png" tabIndex="0" className="focus:outline-none w-full h-44" />
                        </div> */}
                        <div className="w-full py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {e.Items.length === 1 && (
                                <div className="relative w-fit h-fit">
                                <Image
                                    src={e.Items[0].imageSrc || "/product.jpg"}
                                    alt="single image"
                                    width={cardWidth}
                                    height={cardHeight}
                                    layout="responsive"
                                    objectFit="cover"
                                    loading="lazy"
                                    className="rounded-lg"
                                />
                                </div>
                            )}
                            {e.Items.length === 2 && e.Items.map((image, index) => (
                                <div key={index} className="relative w-full h-44">
                                <Image
                                    src={image.imageSrc || "/product.jpg"}
                                    alt={`image ${index + 1}`}
                                    width={cardWidth}
                                    height={cardHeight}
                                    layout="responsive"
                                    objectFit="cover"
                                    loading="lazy"
                                    className="rounded-lg"
                                />
                                </div>
                            ))}
                            {e.Items.length === 3 && e.Items.map((image, index) => (
                                <div key={index} className="relative w-full h-44">
                                <Image
                                    src={image.imageSrc}
                                    alt={`image ${index + 1}`}
                                    width={cardWidth}
                                    height={cardHeight}
                                    layout="responsive"
                                    objectFit="cover"
                                    loading="lazy"
                                    className="rounded-lg"
                                />
                                </div>
                            ))}
                            {e.Items.length > 3 && (
                                <>
                                {e.Items.slice(0, 2).map((image, index) => (
                                    <div key={index} className="relative w-full h-44">
                                    <Image
                                        src={image.imageSrc}
                                        alt={`image ${index + 1}`}
                                        width={cardWidth}
                                        height={cardHeight}
                                        layout="responsive"
                                        objectFit="cover"
                                        loading="lazy"
                                        className="rounded-lg"
                                    />
                                    </div>
                                ))}
                                <div className="relative w-full h-44 rounded-lg overflow-hidden">
                                    <Image
                                    src={e.Items[2].imageSrc}
                                    alt="image 3"
                                    width={cardWidth}
                                    height={cardHeight}
                                    layout="responsive"
                                    objectFit="cover"
                                    loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-semibold">
                                    +{e.Items.length - 3} more
                                    </div>
                                </div>
                                </>
                            )}
                            </div>
                     <div className="bg-white">
                            <div className="flex items-center justify-between px-4 pt-4">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" tabIndex="0" className="focus:outline-none" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2"></path>
                                    </svg>
                                </div>
                                <div className="bg-green-400 py-1.5 px-6 rounded-full">
                                    <p tabIndex="0" className="focus:outline-none text-xs text-yellow-900">Placed</p>
                                </div>
                            </div>
                            <div className="p-4">
                            <div className="w-full overflow-x-auto">
                                    <table className="w-full table-auto border-collapse">
                                        <tbody>
                                        <tr className="border-b">
                                            <td className="p-2 text-lg font-semibold">Order #</td>
                                            <td className="p-2 text-lg font-semibold">{e.ID}</td>
                                            
                                        </tr>
                                        <tr className="border-b">
                                        <td className="p-2 text-xs text-gray-600" colSpan="2">Placed Time</td>
                                            <td className="p-2 text-xs text-gray-600" colSpan="2">{new Date(e.time).toLocaleString()}</td>
                                        </tr>

                                        <tr className="border-b">
                                        <td className="p-2 text-xs text-gray-600" colSpan="2">Customer Name</td>
                                            <td className="p-2 text-xs text-gray-600" colSpan="2">{e.customerName}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 text-xs text-gray-600" colSpan="2">Customer Mobile</td>
                                            <td className="p-2 text-xs text-gray-600" colSpan="2">{e.customerMobile}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    </div>

                                    <div className="w-full mt-4">
                                    <p tabIndex="0" className="focus:outline-none text-xs text-gray-600 font-bold text-center mb-4">TRACKING DETAILS</p>
                                    <table className="w-full table-auto border-collapse">
                                        <tbody>
                                        <tr className="border-b">
                                            <td className="p-4 text-xs text-gray-600 h-20">Delivery company</td>
                                            <td className="p-4 text-xs text-gray-600 h-20">{e.TrackingDetails.company}</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-xs text-gray-600 h-20">Tracking ID</td>
                                            <td className="p-4 text-xs text-gray-600 h-20">{e.TrackingDetails.trackingID}</td>

                                        </tr>
                                        </tbody>
                                    </table>
                                    </div>


                                <div className="flex items-center justify-between py-4">
                                    <h2 tabIndex="0" className="focus:outline-none text-indigo-700 text-xs font-semibold">Total</h2>
                                    <h3 tabIndex="0" className="focus:outline-none text-indigo-700 text-xl font-semibold">Rs {e.postingPrice}/-</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                  )})
                }
                </div>
                 </div>
            </div>
           
    
        }
        
        </>
    )
}