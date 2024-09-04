"use client";
import React, { useEffect, useState } from 'react';
import { app } from '@/app/_private/firebaseConfig';
import { getFirestore,getDoc,doc, updateDoc,Timestamp, setDoc, arrayRemove } from 'firebase/firestore';
import BasicLoader from '@/app/components/basicLoader';
import { toast } from 'react-toastify';
import LoadingOverlay from '@/app/components/bottomLoader';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const UserCheckouts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isloading,setIsloading]=useState(false)
  const [checkouts,setCheckouts]=useState([])
  const [overlayLOading,setOverlayloading]=useState(false)
  const db=getFirestore(app)
  const loginState=useSelector(data=>data.userData)
  const router=useRouter()
  const depositTemp=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Money Has Been Deposited</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            position: relative;
        }
        h1 {
            color: #28a745; /* Green color to indicate success */
        }
        p {
            color: #555555;
            line-height: 1.6;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888888;
            text-align: center;
        }
        .money-animation {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
        }
        .money-animation span {
            position: absolute;
            display: block;
            width: 30px;
            height: 30px;
            background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Money_font_awesome.svg/2048px-Money_font_awesome.svg.png');
            background-size: cover;
            opacity: 0.7;
            animation: float 6s infinite ease-in-out;
        }
        @keyframes float {
            0% {
                transform: translateY(100%);
                opacity: 0.7;
            }
            50% {
                transform: translateY(50%);
                opacity: 0.5;
            }
            100% {
                transform: translateY(-100%);
                opacity: 0;
            }
        }
        /* Randomly place the money icons */
        .money-animation span:nth-child(1) {
            left: 10%;
            animation-delay: 0s;
        }
        .money-animation span:nth-child(2) {
            left: 30%;
            animation-delay: 1s;
        }
        .money-animation span:nth-child(3) {
            left: 50%;
            animation-delay: 2s;
        }
        .money-animation span:nth-child(4) {
            left: 70%;
            animation-delay: 3s;
        }
        .money-animation span:nth-child(5) {
            left: 90%;
            animation-delay: 4s;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Money Has Been Deposited</h1>
        <p>Dear Customer,</p>
        <p>We are pleased to inform you that your funds have been successfully deposited into your account. Please review the details below:</p>
        <p><strong>Amount:</strong> <span class="order-name">Rs ${depositAmount}/-</span></p>
        <p><strong>Date:</strong> <span class="order-name">${new Date().toLocaleString()}</span></p>

        <p>If you have any questions or require further assistance, please do not hesitate to contact our support team.</p>
        <p>Best regards,<br>EASYDROP SHIP</p>
        <div class="footer">
            <p>&copy; 2024 EASYDROP SHIP. All rights reserved.</p>
        </div>
    </div>

    <!-- Money Animation -->
    <div class="money-animation">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
</body>
</html>`
  const SendMAil=async(htmlText,response,sub,text)=>{
    
    let mailRequest=await axios.post("/apis/sendMail",{
      EmailAddress:selectedRecord.Email,
      Text:text,
      Subject:sub,
      Html:htmlText,
      ReturnResponse:response

    },{
        headers: {
          'Content-Type': 'application/json'  
        }
  })
  return mailRequest.data.message
  }
  const updateState=async()=>{
    const docRef=doc(db,'checkoutRequests','RequestedCheckouts')
    let userData=await getDoc(docRef)
    if(userData.exists()){
      setCheckouts(userData.data().Requests)
      return
    }else{
      setCheckouts([])
    }
  }
  const handleDeposit = async(record) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = async() => {
    setOverlayloading(true)
    const docRef=doc(db,"checkouts",`${selectedRecord.Email}`)
    const docRef2=doc(db,"checkoutRequests","RequestedCheckouts")
    const data=await getDoc(docRef)
    if(data.exists()){
      let usersData=data.data().Details
      usersData.unshift({
        Amount:depositAmount,
        Date:Timestamp.now()
      })
      let updatedTotal=parseInt(data.data().TotalAmount) + parseInt(depositAmount)
      await updateDoc(docRef,{
        Details:usersData,
        TotalAmount:updatedTotal
    })
    try{
    await updateDoc(docRef2,{
      Requests:arrayRemove(selectedRecord)
    })
    let mailReq=await SendMAil(depositTemp,"Deposit Email sent","Money Deposited","We have deposited....")
    await updateState()
    
            if(mailReq === "Deposit Email sent"){
              console.log("sending emaail")
    toast.success(`${depositAmount} is deposited to ${selectedRecord.Email}`);
    setIsDialogOpen(false);
    setOverlayloading(false)
            }else{
    toast.success(`${depositAmount} is deposited to ${selectedRecord.Email}!,But unable to send Email to dropshipper`);
    setIsDialogOpen(false);
    setOverlayloading(false)
            }
  }catch(error){
    setOverlayloading(false)
        toast.error("Unable to deposite amount")
        setIsDialogOpen(false);
        console.log(error)
  }
   
    return
  }
    else{
      let datatopost={
        Details:[
          {
            Amount:depositAmount,
            Date:Timestamp.now()
          }
        ],
        TotalAmount:parseInt(depositAmount)
      }
      try{
      await setDoc(docRef,datatopost)
      await updateDoc(docRef2,{
        Requests:arrayRemove(selectedRecord)
      })
      await updateState()
      setIsDialogOpen(false);
      toast.success(`${depositAmount} is deposited to ${selectedRecord.Email}`)
      setOverlayloading(false)
    }
      catch(error){
        setIsDialogOpen(false);
        setOverlayloading(false)
        toast.error("Unable to deposite amount")
        console.log(error)
      }
      return false 
    }
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
    setDepositAmount('');
  };
 const handleDelete=async(record)=>{
  setOverlayloading(true)
  const docRef=doc(db,"checkoutRequests","RequestedCheckouts");
  try{
    await updateDoc(docRef,{
      Requests:arrayRemove(record)
    })
    await updateState()
    setOverlayloading(false)
    toast.success("DELETED")
  }catch(error){
    await updateState()
    setOverlayloading(false)
    toast.success("Error deleting record")
    console.log(error)
  }
 }


useEffect(()=>{
  if(!loginState.login || !loginState.isAdmin){
    router.replace("/login")
  }
async function getData() {

    setIsloading(true)
    const docref=doc(db,"checkoutRequests","RequestedCheckouts")
    let usersData=await getDoc(docref)
    if(usersData.exists()){
        setCheckouts(usersData.data().Requests) 
    }else{
        setCheckouts([])
    }
    setIsloading(false)
}
getData()
},[])
  return (  
    <>
    {overlayLOading && <LoadingOverlay/>}
    { isloading ? <BasicLoader/> :
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Search Bar and Button */}
      <div className="mb-6 flex justify-center">
        <div className="flex items-center space-x-2 w-full max-w-4xl">
          <input
            type="text"
            placeholder="Search by Email"
            className="border p-2 w-full rounded-md"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Current Balance</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkouts
              .filter(record => record.Email.includes(searchTerm))
              .map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">{record.Email}</td>
                  <td className="py-3 px-6">Rs {record.Amount}/-</td>
                  <td className="py-3 px-6">Rs {record.CurrentBalance}/-</td>
                  <td className="py-3 px-6">{(record.Date).toDate().toLocaleString()}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDeposit(record)}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-emerald-700"
                    >
                      Deposit
                    </button>
                    <button
                    onClick={()=>handleDelete(record)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Deposit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Deposit Amount</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="border p-2 mb-4 w-full rounded-md"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-200 px-4 py-2 mr-2 rounded-md"
                onClick={handleDialogCancel}
              >
                Cancel
              </button>
              <button
                className="bg-emerald-500 text-white px-4 py-2 rounded-md"
                onClick={handleDialogSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
}
    </>
  );
};

export default UserCheckouts;
