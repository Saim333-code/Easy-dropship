"use client"
import React, { useState,useEffect} from 'react';
import BasicLoader from './basicLoader';
import { app } from '../_private/firebaseConfig';
import { getFirestore,doc,getDoc, updateDoc } from 'firebase/firestore';
import NOdatacard from './noDatacard';
import LoadingOverlay from './bottomLoader';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import UserTableWithPopup from './verifiedUsers';

const UserSearchInfo = () => {
  const [user, setUser] = useState(null);
  const [clear,setClear]=useState(false)
  const [searchTerm,setSearchTerm]=useState("")
  const [isLoading,setIsLoading]=useState(false)
  const [securityFees,setSecurityFees]=useState(0)
  const [overlayLoading,setOverLayloading]=useState(false)
  const [updated,setupdated]=useState(false)
  const [count,setCount]=useState(0)
  const db=getFirestore(app)
  const router=useRouter();
  const loginState=useSelector(data=>data.userData)
  const updateCount=(newCount)=>{
    setCount(newCount)
  }

  let handleGetDelivery=async()=>{
    const docRef=doc(db,"Delivery","info")
    const getCharges=await getDoc(docRef)
    if(getCharges.exists()){
      return parseInt(getCharges.data().Charges)
    }else{
      toast.error("unable to get delivery charges! due to which can't calculte user profits....")
      return 0;
    }
  }





  const handleSearch = async() => {
  
    setIsLoading(true)
    setClear(true)
    const docRef=doc(db,"verifiedUsers",`${searchTerm}`)
    const userSearchData=await getDoc(docRef)
    if(userSearchData.exists()){
      let user=userSearchData.data();
    const docRef=doc(db,"userFulfilledOrders",`${searchTerm}`)
    const userData=await getDoc(docRef);
    if(userData.exists()){
      let orders=userData.data().FulfilledOrders;

      let ordersTotal=orders.reduce((acc,it)=>{
        return acc+parseInt(it.Total)
      },0)
      let shipperTotal=orders.reduce((acc,it)=>{
        return acc+parseInt(it.postingPrice)
      },0)

      let Delivery=await handleGetDelivery();


      let userProfit=(shipperTotal-Delivery)-ordersTotal;
      user["Total_profit"]=userProfit;

      let withdrawRef=doc(db,"checkouts",`${user.Email}`)
      let withDrawData=await getDoc(withdrawRef)
          let totalWithDraw=0;
        if(withDrawData.exists()){
          totalWithDraw=parseInt(withDrawData.data().TotalAmount)
          user["Withdrawed_amount"]=totalWithDraw;
          user["Pending_payment"]=userProfit-totalWithDraw
        }else{
          totalWithDraw=0;
          user["Withdrawed_amount"]=0;
          user["Pending_payment"]=userProfit;
        }
    }else{
      user["Total_profit"]=0;
      user["Withdrawed_amount"]=0;
      user["Pending_payment"]=0;
    }
       setUser(user)
    }else{
        setUser(null)
    }
    setIsLoading(false)
  };

  const handleClear = async() => {
    setIsLoading(true)
    setSearchTerm("")
    setUser(null);
    setClear(false)
    setIsLoading(false)
  };

  const handleSubmit = async() => {
    if(isNaN(securityFees)){
        return
    }
    setOverLayloading(true)
    const docRef=doc(db,"verifiedUsers",`${searchTerm}`)
    let choice=window.confirm(`Updating ${searchTerm} security fee `)
    if(choice){
    await updateDoc(docRef,{
        Security:securityFees
    })
    let userData=await getDoc(docRef)
    if(userData.exists()){
        setUser(userData.data())
        setupdated(prev=>!prev)
     }else{
         setUser(null)
         setupdated(prev=>!prev)
     }
    setOverLayloading(false)
    router.refresh();
    toast.success("updated Security Fees")

}else{
    setOverLayloading(false)
}
  };


useEffect(()=>{
if(!loginState.login || !loginState.isAdmin){
router.replace("/login")
}
},[])

  return (
    <>
    { 
    overlayLoading &&
    <LoadingOverlay/>
    }
    
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6 relative">
      <div className="absolute top-3 left-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-md shadow-md">
            Total users count: {count}
          </div>
        <input
          type="email"
          placeholder="Enter User's Email"
          className="p-2 w-full max-w-lg border rounded-md"
          onChange={(e)=>setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        {!clear ? 
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-700"
        >
          Search
        </button>
         :
         <button
         onClick={handleClear}
         className="ml-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-700"
       >
         clear
       </button>
        }
      </div>


      {isLoading ? <BasicLoader/> :(user ? (
          <div className=" max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
          {/* Total user count label */}
          
    
          {/* User details */}
          <h2 className="text-2xl font-bold mb-4 text-emerald-600">{user.Name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><strong>Cnic: </strong>{user.Cnic}</p>
            <p><strong>Email: </strong>{user.Email}</p>
            <p><strong>Mobile: </strong> {user.Mobile}</p>
            <p><strong>Security: </strong>Rs {user.Security}/-</p>
            <p><strong>Address:</strong> {user.Address}</p>
            <p><strong>Password: </strong> {user.Password}</p>
            <p><strong>Bank Name: </strong> {user.Bank}</p>
            <p><strong>Bank Account no: </strong> {user.BankAccountNumber}</p>
            <p><strong>Name on card:</strong>{user.Cardname}</p>
            <p><strong>Brand Name:</strong> {user.Brandname}</p>
              <p><strong>Total Profit Earned:</strong>Rs {user.Total_profit}/-</p>
              <p><strong>Total Amount Withdrawed:</strong>Rs {user.Withdrawed_amount}/-</p>
              <p><strong>Total Amount Pending:</strong>Rs {user.Pending_payment}/-</p>
          </div>
    
          <div className="mt-6 flex">
            <input
              type="number"
              placeholder="Update Security Fees"
              className="p-2 w-full border rounded-md"
              onChange={(e) => {
                if (e.target.value && e.target.value > 0) {
                  setSecurityFees(parseInt(e.target.value));
                } else {
                  setSecurityFees(0);
                }
              }}
            />
            <button
              onClick={handleSubmit}
              className="ml-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-700"
            >
              Submit
            </button>
          </div>
        </div>
      ):
      // <NOdatacard text="No data to display"/>
      <></>
      )}
      <UserTableWithPopup
       updateCount={updateCount}
        placeholder={"update security fees"} 
        handleSubmit={handleSubmit} 
        setSecurityFees={setSecurityFees}
        overlayLoading={overlayLoading}
        setOverLayloading={setOverLayloading}
        updated={updated}
        />
    </div>
    
   
    </>
  );
 
};

export default UserSearchInfo;
