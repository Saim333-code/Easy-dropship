"use client";

import React, { useEffect, useState } from "react";
import { app } from "../_private/firebaseConfig";
import { getFirestore,getDocs, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import OrderCard from "./placedOrderscard";
import NOdatacard from "./noDatacard";
import BasicLoader from "./basicLoader";
import { useSelector } from "react-redux";

const AdminPlacedOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [placedorders,setPlacedorders]=useState([]);
  const [loading,setLoading]=useState(true)
  const [isSearchClicked,setisSearchClicked]=useState(false)
  const loginState=useSelector((data)=>data.userData)
  const router=useRouter();
  const db=getFirestore(app)
 
const handleSearch=async()=>{
  if(!(loginState.login && loginState.isAdmin)){
    router.replace("/login")
    }
  if(searchTerm !== ""){
  setisSearchClicked(prev=>!prev)
  let updatedOrders=placedorders.filter((order)=>{
   return order.shipperEmail === searchTerm
  })
  setPlacedorders(updatedOrders)
}else{
  return
}
}

const handleClear=async()=>{
  if(!(loginState.login && loginState.isAdmin)){
    router.replace("/login")
    }
  setSearchTerm("")
  setLoading(true)
  setisSearchClicked(false)
  const query = await getDocs(collection(db,"placedOrders"))
  const data=query.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  console.log(data)
  setPlacedorders(data)
  setLoading(false)
return
}
useEffect(()=>{
if(!(loginState.login && loginState.isAdmin)){
router.replace("/login")
}
async function getData(){
const query = await getDocs(collection(db,"placedOrders"))
const data=query.docs.map(doc => ({ id: doc.id, ...doc.data() }))
console.log(data)
setPlacedorders(data)
setLoading(false)
}
getData()
},[])

  return (
    <>
    {
        loading ? <BasicLoader/> :
        <div>
        <div className="p-6">
        <h1 className="text-2xl font-bold text-emerald-700 mb-6">Placed Orders</h1>
        <div className="mb-4 flex">
          <input
            type="email"
            placeholder="Search by dropshippers  email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
                  {isSearchClicked ? (
            <button
              onClick={handleClear}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
            >
              Clear
            </button>
          ) : (
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-700"
            >
              Search
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {placedorders.length>0 ? placedorders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            setPlacedorders={setPlacedorders}
            setLoading={setLoading}
          />
        ))
    :
    <NOdatacard text="NO orders placed"/>
    }
      </div>
    </div>
}
</>
  );
};

export default AdminPlacedOrders;
