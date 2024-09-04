"use client";

import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { collection, query, orderBy, limit, startAfter, getDocs, getFirestore, doc } from 'firebase/firestore';
import Image from 'next/image';
import { app } from '@/app/_private/firebaseConfig';
import Loader from '@/app/components/bottomLoader';
import BasicLoader from '@/app/components/basicLoader';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
export default function FulfilledOrders() {
  const [orders, setOrders] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm,setSearchTerm]=useState("")
  const [clear,setClear]=useState(false)
  const [isLoading,setIsloading]=useState(false)
  const loginState=useSelector(data=>data.userData)
  const router=useRouter()
  const db = getFirestore(app);
    
  const handleSearch=async()=>{
    setClear(true)
    setIsloading(true)
    const docRef=collection(db,"fulfilledOrders")
    const fulfilledData=await getDocs(docRef)
    const data=fulfilledData.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const FilterdOrders=data.filter((e)=>{
      if(e.shipperEmail === searchTerm || parseInt(e.ID) === parseInt(searchTerm) || e.city === searchTerm || e.customerName === searchTerm){
        return e;
      }
    })
    setOrders(FilterdOrders)
    setIsloading(false)
    return 
  }
  const handleClear=async()=>{
    setClear(false)
    setSearchTerm("")
    return 
  }
  // Fetch initial data
  const fetchOrders = async () => {
    const ordersQuery = query(
      collection(db, 'fulfilledOrders'),
      orderBy('time', 'desc'),
      limit(2)
    );

    const data = await getDocs(ordersQuery);
    const ordersData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisibleDoc = data.docs[data.docs.length - 1];

    setOrders(ordersData);
    setLastVisible(lastVisibleDoc);
    setHasMore(data.docs.length > 0);
  };

  // Load more data when scrolling
  const loadMoreOrders = async () => {
    if (!lastVisible) return;

    const ordersQuery = query(
      collection(db, 'fulfilledOrders'),
      orderBy('time', 'desc'),
      startAfter(lastVisible),
      limit(10)
    );

    const data = await getDocs(ordersQuery);
    const newOrders = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisibleDoc = data.docs[data.docs.length - 1];

    setOrders(prevOrders => [...prevOrders, ...newOrders]);
    setLastVisible(lastVisibleDoc);
    setHasMore(data.docs.length > 0);
  };

  useEffect(() => {
    if(loginState.login && loginState.isAdmin){
    if(searchTerm === ""){
    fetchOrders();
  }
}else{
router.replace("/login")
}
  }, [searchTerm]);

  return (
  <>
  <div className="p-6 max-w-5xl mx-auto text-center">
  <h1 className="text-3xl font-bold text-emerald-700 mb-6">Fulfilled Orders</h1>
  <div className="mb-6 flex justify-center">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by email, customer name..."
        className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none w-full max-w-md"
      />
      
    { !clear && <button
        onClick={handleSearch}
        className={`px-4 py-2 bg-emerald-600 text-white rounded-r-md focus:outline-none transition-colors duration-200
        `}
        
      >
        Search
      </button>
      }
      {clear &&
      <button
        onClick={handleClear}
        className={`px-4 py-2 bg-red-500 text-white rounded-r-md focus:outline-none transition-colors duration-200
        `}
        
      >
        clear
      </button>
      }
      
      
     
    </div>
  { isLoading ? <BasicLoader/> :( searchTerm === "" ? (
  <InfiniteScroll
    dataLength={orders.length}
    next={loadMoreOrders}
    hasMore={hasMore}
    loader={<BasicLoader />}
    endMessage={<p>No more orders to load</p>}
  >
    <div className="space-y-6">
      {orders.map((order, index) => (
        <div
          key={index}
          className="bg-white shadow-xl rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105 mx-auto max-w-3xl"
        >
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center items-center md:justify-start md:items-start p-5 md:w-1/3">
              <div className="grid grid-cols-3 gap-3">
                {order.Items.slice(0, 3).map((image, idx) => (
                  <div key={idx} className="w-24 h-24 relative">
                    <Image
                      src={image.imageSrc || '/product.jpg'}
                      alt="Product Image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md border border-gray-300"
                    />
                  </div>
                ))}
                {order.Items.length > 3 && (
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                    <span className="text-gray-700 text-lg font-semibold">
                      +{order.Items.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 md:w-2/3 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {order.shipperEmail}
              </h2>
              <p className="text-gray-600 mb-4">{(order.time).toDate().toLocaleString()}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Order ID:</span> {order.ID}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Status:</span> {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Customer Name:</span> {order.customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Customer Mobile:</span> {order.customerMobile}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700 text-xs">Customer Email:</span> {order.customerEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700 text-xs">Customer Address:</span> {order.postingAddress}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Delivery Company:</span> {order.TrackingDetails.company}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Tracking ID:</span> {order.TrackingDetails.trackingID}
                  </p>

                  <p className="text-lg text-gray-500 font-bold">
                    <span className="font-medium text-gray-700 text-sm">Dropshipper Price: </span>Rs {order.postingPrice}/-
                  </p>
                </div>
                <div className="flex justify-center items-center md:justify-end">
                  <p className="text-2xl font-bold text-emerald-700">
                    Rs {order.Total}/-
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </InfiniteScroll>
) :
(

  <div className="space-y-6">
      {orders.map((order, index) => (
        <div
          key={index}
          className="bg-white shadow-xl rounded-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105 mx-auto max-w-3xl"
        >
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center items-center md:justify-start md:items-start p-5 md:w-1/3">
              <div className="grid grid-cols-3 gap-3">
                {order.Items.slice(0, 3).map((image, idx) => (
                  <div key={idx} className="w-24 h-24 relative">
                    <Image
                      src={image.imageSrc || '/product.jpg'}
                      alt="Product Image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md border border-gray-300"
                    />
                  </div>
                ))}
                {order.Items.length > 3 && (
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                    <span className="text-gray-700 text-lg font-semibold">
                      +{order.Items.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 md:w-2/3 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {order.shipperEmail}
              </h2>
              <p className="text-gray-600 mb-4">{(order.time).toDate().toLocaleString()}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Order ID:</span> {order.ID}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Status:</span> {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Customer Name:</span> {order.customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Customer Mobile:</span> {order.customerMobile}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700 text-xs">Customer Email:</span> {order.customerEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700 text-xs">Customer Address:</span> {order.postingAddress}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Delivery Company:</span> {order.TrackingDetails.company}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Tracking ID:</span> {order.TrackingDetails.trackingID}
                  </p>

                  <p className="text-lg text-gray-500 font-bold">
                    <span className="font-medium text-gray-700 text-sm">Dropshipper Price: </span>Rs {order.postingPrice}/-
                  </p>
                </div>
                <div className="flex justify-center items-center md:justify-end">
                  <p className="text-2xl font-bold text-emerald-700">
                    Rs {order.Total}/-
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
)

)
}
</div>
</>
  );
}

