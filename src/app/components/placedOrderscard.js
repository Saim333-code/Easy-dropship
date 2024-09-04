import React, { useState } from 'react';
import { app } from '../_private/firebaseConfig';
import { getFirestore,doc,getDoc, updateDoc,deleteDoc, getDocs,collection, setDoc, arrayUnion,Timestamp} from 'firebase/firestore';
import { toast } from 'react-toastify';
import axios from 'axios';
const OrderCard = (props) => {
  const [showInputField, setShowInputField] = useState(false);
  const [returnPrice, setReturnPrice] = useState(0);
  const db=getFirestore(app)
  const {
  id,
  ID,
  Total,
  city,
  customerEmail,
  customerMobile,
  customerName,
  postingAddress,
  postingName,
  postingPrice,
  postingState,
  shipperEmail,
  status,
  time,
  zip,
  TrackingDetails,
  Items

}=props.order
const fulfilledMail=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Been Fulfilled and Returned</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #28a745; /* Green color to indicate fulfillment */
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
        .order-name {
            display: inline-block;
            border-bottom: 1px solid #333;
            width: 200px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Order Has Been Fulfilled </h1>
        <p>We are pleased to inform you that your order with EASYDROP SHIP has been successfully fulfilled as per your request.</p>
        <p><strong>Order Number:</strong> <span class="order-name">${ID}</span></p>
        <p><strong>Customer Name:</strong> <span class="order-name">${customerName}</span></p>
        <p><strong>Time:</strong> <span class="order-name">${new Date().toLocaleString()}</span></p>    
        <p><strong>Total Price:</strong> <span class="order-name">${postingPrice}</span></p>

        <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>EASYDROP SHIP</p>
        <div class="footer">
            <p>&copy; 2024 EASYDROP SHIP. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
  const returnedMail=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Been Returned</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #ff6347; /* Tomato color to indicate a return */
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
        .order-name {
            display: inline-block;
            border-bottom: 1px solid #333;
            width: 200px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your Order Has Been Returned</h1>
        
        <p>We would like to inform you that your order with EASYDROP SHIP has been successfully returned. If this return was not expected or you have any concerns, please contact our support team for assistance.</p>
        <p><strong>Order Number:</strong> <span class="order-name">${ID}</span></p>
        <p><strong>Customer Name:</strong> <span class="order-name">${customerName}</span></p>
        <p><strong>Time:</strong> <span class="order-name">${new Date().toLocaleString()}</span></p>    
        <p><strong>Total Price:</strong> <span class="order-name">${postingPrice}</span></p>

        <p>If you have any questions or need further assistance, please don't hesitate to reach out to our support team.</p>
        <p>Best regards,<br>EASYDROP SHIP</p>
        <div class="footer">
            <p>&copy; 2024 EASYDROP SHIP. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

  const SendMAil=async(htmlText,response,sub,text)=>{
    console.log("sending Email")
    let mailRequest=await axios.post("/apis/sendMail",{
      EmailAddress:shipperEmail,
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


const getSecurityFee=async()=>{
const userRef=doc(db,"verifiedUsers",`${shipperEmail}`)
const userdata=await getDoc(userRef)
if(userdata.exists()){
  return parseInt(userdata.data().Security)
}else{
  return 0;
}
}
const updateSecurityFee=async(oldfee,deductFee)=>{
const fee=oldfee-deductFee;
const userRef=doc(db,"verifiedUsers",`${shipperEmail}`)
if(fee === 0 || fee < 0){
  try{
    await updateDoc(userRef,{
    Security:0
    })
    return
  }catch(err){
      toast.error("Unable to update data")
      console.log(err)
      return
    }
}
try{
await updateDoc(userRef,{
Security:fee
})
return
}catch(err){
  toast.error("Unable to update data")
  console.log(err)
  return
}
}

const removeFromplaced=async()=>{
  const docRef=doc(db,"placedOrders",`${id}`)
  try {
    await deleteDoc(docRef)
  } catch (error) {
    toast.error("Error returning order")
    toast.success("security fess updated but unable to remove from placed orders")
    return
  }
}
const removeFromUserplaced=async()=>{
  const docRef=doc(db,"usersPlacedOrders",`${shipperEmail}`)
  const placedOrdersData=await getDoc(docRef);
  if(placedOrdersData.exists()){
  let orders=placedOrdersData.data().placedOrders
 let updatedOrders=orders.filter((order)=>{
    return order.ID !== ID
  })

  if(updatedOrders.length === 0){
    await deleteDoc(docRef)
  }else{
    updateDoc(docRef,{
      placedOrders:updatedOrders
    })
  }
}
}

const updateState=async()=>{
const query = await getDocs(collection(db,"placedOrders"))
const data=query.docs.map(doc => ({ id: doc.id, ...doc.data() }))
props.setPlacedorders(data)

}
const doesDocumentExist=async () =>{
  try {
    const docRef = doc(db,"returnedOrders", `${shipperEmail}`);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
     
      return true; // Document exists
    } else {
      return false; // Document does not exist
    }
  } catch (error) {
    console.error("Error checking document existence:", error);
    return false
    throw error; // Re-throw the error to handle it in calling function
  }
}

const fulfilledDocumentExists=async () =>{
  try {
    const docRef = doc(db,"userFulfilledOrders", `${shipperEmail}`);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
     
      return true; // Document exists
    } else {
      return false; // Document does not exist
    }
  } catch (error) {
    console.error("Error checking document existence:", error);
    return false
    throw error; // Re-throw the error to handle it in calling function
  }
}

const addToreturned=async()=>{
  if(await doesDocumentExist()){
    const docRef=doc(db,"returnedOrders",`${shipperEmail}`)
    const usersOrdersdata=await getDoc(docRef);
    let data=usersOrdersdata.data().ReturnedOrders
     props.order.status="returned"
     props.order.time=Timestamp.now()
    data.unshift(props.order)
    await updateDoc(docRef,{
      ReturnedOrders:data
    })
    return
  }
  const docRef=doc(db,"returnedOrders",`${shipperEmail}`)
  props.order.status="returned"
  props.order.time=Timestamp.now()
  await setDoc(docRef,{
    ReturnedOrders:[props.order]
  })
}
const returnFunction=async()=>{
  setShowInputField(true);
}

const handleSubmit=async()=>{
  props.setLoading(true)
  const oldFee=await getSecurityFee();
  await updateSecurityFee(oldFee,returnPrice);
  setShowInputField(false);
  setReturnPrice(0)
  await addToreturned()
  await removeFromplaced()
  await removeFromUserplaced()
  let mailreq=await SendMAil(returnedMail,"returned order mail sent","Order Returned","Your order has been Returned")
  await updateState()
 
if(mailreq === "returned order mail sent"){
 props.setLoading(false)
}else{
  toast.error("Order marked as Returned,But unable to send mail due to server issues")
  props.setLoading(false)
}
  props.setLoading(false)
  console.log("returned")
}
const addTofulfilled=async()=>{
  const fulfilledRef=doc(db,"fulfilledOrders",`${shipperEmail}${Date.now()}`)
  await setDoc(fulfilledRef,props.order)
  return
}
const fulfilledFunction=async()=>{
  props.order.status="fulfilled"
  props.order.time=Timestamp.now()
props.setLoading(true)
await addTofulfilled()
const userFulfilled=doc(db,"userFulfilledOrders",`${shipperEmail}`)
if(await fulfilledDocumentExists()){
  let fulfilledData=await getDoc(userFulfilled)
  let data=fulfilledData.data().FulfilledOrders
  data.unshift(props.order)
 await updateDoc(userFulfilled,{
  FulfilledOrders:data
 })
 await removeFromUserplaced()
await removeFromplaced()
await updateState()
let mailreq=await SendMAil(fulfilledMail,"Fulfilled order mail sent","Order Fullfilled","Your order has been fullfilled")
if(mailreq === "Fulfilled order mail sent"){
 props.setLoading(false)
}else{
  toast.error("Order marked as fullfilled,But unable to send mail due to server issues")
  props.setLoading(false)
}

  return
}


await setDoc(userFulfilled,{
  FulfilledOrders:[props.order]
})

await removeFromUserplaced()
await removeFromplaced()
await updateState()
props.setLoading(false)
}


  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 mb-4">
      {/* Time in the top-right corner */}
      <p className="absolute top-2 right-2 text-gray-500 text-sm">
        {new Date(time).toLocaleString()}
      </p>

      <h3 className="text-lg font-semibold text-emerald-700 mb-4">{`Order #${ID}`}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-700"><strong>Total:</strong> Rs {Total}/-</p>
          <p className="text-gray-500"><strong>City:</strong> {city}</p>
          <p className="text-gray-500"><strong>Customer Email:</strong> {customerEmail}</p>
          <p className="text-gray-500"><strong>Customer Mobile:</strong> {customerMobile}</p>
          <p className="text-gray-500"><strong>Customer Name:</strong> {customerName}</p>
          <p className="text-gray-500"><strong>Posting Address:</strong> {postingAddress}</p>
          <p className="text-gray-500"><strong>Posting Name:</strong> {postingName}</p>
          <p className="text-gray-500"><strong>Posting Price:</strong> {postingPrice}</p>
          <p className="text-gray-500"><strong>Posting State:</strong> {postingState}</p>
          <p className="text-gray-500"><strong>Shipper Email:</strong> {shipperEmail}</p>
          <p className="text-gray-500"><strong>Status:</strong> {status}</p>
          <p className="text-gray-500"><strong>ZIP:</strong> {zip}</p>
        </div>
        
        <div>
          <h4 className="text-md font-semibold text-emerald-600 mb-2">Tracking Details</h4>
          <p className="text-gray-500"><strong>Company:</strong> {TrackingDetails.company}</p>
          <p className="text-gray-500"><strong>Tracking ID:</strong> {TrackingDetails.trackingID}</p>
          
          {/* Image Gallery */}
          <div className="flex space-x-2 overflow-x-auto mt-4">
            {Items.map((src, index) => (
              <img
                key={index}
                src={src.imageSrc}
                alt={`Product Image ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Centered buttons */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={fulfilledFunction}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
        >
          Fulfilled
        </button>
        <button
          onClick={returnFunction}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Return
        </button>
      </div>

      {/* Input field for return reason */}
      {showInputField && (
        <div className="mt-4">
          <input
            type="text"
            value={returnPrice}
            onChange={(e) =>{ 
              if(e.target.value){
              setReturnPrice(parseInt(e.target.value))
            }else{
              setReturnPrice(0)
            }
          }
            }
            placeholder="Enter return amount"
            className="border border-gray-300 rounded-lg p-2 w-full mb-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 w-full"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
