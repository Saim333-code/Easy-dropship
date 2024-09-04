"use client"
import React, { useState,useEffect} from 'react';
import BasicLoader from '@/app/components/basicLoader';
import { app } from '@/app/_private/firebaseConfig';
import { getFirestore,doc,getDoc, updateDoc, Timestamp, setDoc } from 'firebase/firestore';
import NOdatacard from '@/app/components/noDatacard';
import LoadingOverlay from '@/app/components/bottomLoader';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
const UserSearchInfo = () => {
  const [user, setUser] = useState(null);
  const [clear,setClear]=useState(false)
  const [searchTerm,setSearchTerm]=useState("")
  const [isLoading,setIsLoading]=useState(false)
  const [DepositAmount,setDepositAmount]=useState(0)
  const [overlayLoading,setOverLayloading]=useState(false)
  const db=getFirestore(app)
  const router=useRouter();
  const loginState=useSelector(data=>data.userData)
 
  const handleSearch = async() => {
  
    setIsLoading(true)
    setClear(true)
    const docRef=doc(db,"verifiedUsers",`${searchTerm}`)
    const userData=await getDoc(docRef)
    if(userData.exists()){
       setUser(userData.data())
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
    if(isNaN(DepositAmount)){
        return
    }
    setOverLayloading(true)
    const docRef=doc(db,"checkouts",`${user.Email}`)
    let choice=window.confirm(`Depositing Rs ${DepositAmount} to ${user.Email}`)
    if(choice){
    let userData=await getDoc(docRef)
    if(userData.exists()){
    let updatedData=userData.data().Details
    let updatedTotal=parseInt(userData.data().TotalAmount) + parseInt(DepositAmount)
        updatedData.unshift({
            Amount:parseInt(DepositAmount),
            Date:Timestamp.now()
        })
    try{
        await updateDoc(docRef,{
            Details:updatedData,
            TotalAmount:updatedTotal
        })
        toast.success(`Rs ${DepositAmount}/- deposited  to ${user.Email}`)
        setOverLayloading(false)
        setUser("")
        
    }catch(error){
        toast.error("Unable to deposit please try again later")
        console.log(error)
    }
    }else{
        let dataTopost={
            Details:[
                {
                    Amount:parseInt(DepositAmount),
                    Date:Timestamp.now()
                }
            ],
            TotalAmount:parseInt(DepositAmount)
        }
        try{
            await setDoc(docRef,dataTopost)
            toast.success(`Rs ${DepositAmount}/- deposited  to ${user.Email}`)
            setOverLayloading(false)
            setUser("")
        }catch(error){
            toast.error("Unable to deposit money")
            setOverLayloading(false)
             setUser("")
        }
    }
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
      <div className="flex justify-center mb-6">
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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4 text-emerald-600">Deposit Money </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p><strong>Name: </strong>{user.Name}</p>
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
            
          </div>

          <div className="mt-6 flex">
            <input
              type="number"
              placeholder="Enter Deposit Amount"
              className="p-2 w-full border rounded-md"
              onChange={(e)=>{
                if(e.target.value){
                    setDepositAmount(parseInt(e.target.value))
                }else{
                    setDepositAmount(0)
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
      <NOdatacard text="No data to display"/>
      )}
    </div>
    
   
    </>
  );
 
};

export default UserSearchInfo;
