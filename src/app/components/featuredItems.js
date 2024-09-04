"use client";
import React, { useEffect, useState } from "react";
import { app } from "../_private/firebaseConfig";
import { getFirestore,collection,getDocs,query,orderBy,limit} from "firebase/firestore";
import BasicLoader from "./basicLoader";
import Link from "next/link";
import Image from "next/image";

const FeaturedItems = () => {

    const [featuredItems,setFeaturedItems]=useState([])
    const [isLoading,setIsloading]=useState(false)
    const db=getFirestore(app)

    let getData=async()=>{
        const ref=collection(db,"products")
        try {
            let q=query(ref,orderBy("uploadedAt","desc"),limit(4))
            let productsData=await getDocs(q);
            let products=productsData.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setFeaturedItems(products)
            return
        } catch (error) {
            setFeaturedItems([])
        }

    }
    useEffect(()=>{
        async function DataLoader() {
            setIsloading(true)
            getData()
            setIsloading(false) 
        }
        DataLoader()
        
    },[])
  return (
    <>
    {isLoading ? (
      <BasicLoader />
    ) : (
      <div className="w-full py-12 px-8 bg-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105"
            >
              <div className="relative">
                <Image
                  src={item.productsPageURL}
                  alt={item.productname}
                  width={500}
                  height={500}
                  className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  priority
                />
                <div className="absolute top-0 right-0 p-4 text-white bg-black bg-opacity-50 rounded-bl-lg">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25a4.5 4.5 0 0 1 4.5 4.5v8.5a4.5 4.5 0 0 1-4.5 4.5 4.5 4.5 0 0 1-4.5-4.5V6.75A4.5 4.5 0 0 1 12 2.25zM8.25 12a3.75 3.75 0 1 0 7.5 0v-3.75h-7.5V12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.productname}</h3>
                <p className="text-gray-700 mb-4">
                  {item.description.length > 15
                    ? item.description.split(" ").slice(0, 15).join(" ") +
                      (item.description.split(" ").length > 15 ? "..." : "")
                    : item.description}
                </p>
                <div className="mb-4">
                  <span className="text-emerald-500 font-bold text-xl">
                    Rs {item.price}/-
                  </span>
                  <span className="text-gray-500 line-through ml-2">
                    Rs {item["cutoff-price"]}/-
                  </span>
                </div>
                <Link
                  href={`/products/${item.id}`}
                  className="inline-flex items-center bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors duration-300"
                >
                  Shop Now
                  <svg
                    className="w-4 h-4 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l7-7 7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </>
  );
};

export default FeaturedItems;
