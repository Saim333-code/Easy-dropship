"use client"
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { app } from "../_private/firebaseConfig";
import axios from "axios";
import { getFirestore,getDocs,doc,setDoc,collection,arrayRemove,updateDoc,Timestamp, getDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./bottomLoader";
const OrdersumAdmin = (props) => {
const {ID,time,postingAddress,customerEmail,customerMobile,postingName,customerName,zip,city,postingState,postingPrice,Total,status,Items,shipperEmail}=props.item
const [showDialog, setShowDialog] = useState(false);
const [isOverlayLoading,setOverLayLoading]=useState(false)
const [formData, setFormData] = useState({ company: '', trackingID: '' });

const router=useRouter()
const db=getFirestore(app);
const DeleteOrderedMail=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Been Deleted</title>
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
            color: #FF0000; /* Red color to indicate deletion */
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
        <h1>Your Order Has Been Deleted</h1>
        <p>We regret to inform you that your order with EASYDROP SHIP has been deleted. If this was a mistake or if you have any questions, please contact our support team as soon as possible.</p>
        <p><strong>Order Number:</strong> <span class="order-name">${ID}</span></p>
        <p><strong>Customer Name:</strong> <span class="order-name">${customerName}</span></p>
        <p><strong>Time:</strong> <span class="order-name">${new Date().toLocaleString()}</span></p>    
        <p><strong>Total Price:</strong> <span class="order-name">${postingPrice}</span></p>

        <p>We apologize for any inconvenience caused. Please do not hesitate to reach out if you need further assistance.</p>
        <p>Best regards,<br>EASYDROP SHIP</p>
        <div class="footer">
            <p>&copy; 2024 EASYDROP SHIP. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
const placedOrderdMail=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Been Placed!</title>
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
            color: #333333;
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
        .product-image {
            margin-top: 10px;
            max-width: 100%;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="color: green">Your Order Has Been Placed!</h1>
        <p>Thank you for your order with EASYDROP SHIP! We are pleased to confirm that your order has been successfully placed.</p>
        <p><strong>Order Number:</strong> <span class="order-name">${ID}</span></p>
        <p><strong>Customer Name:</strong> <span class="order-name">${customerName}</span></p>
        <p><strong>Time:</strong> <span class="order-name">${new Date().toLocaleString()}</span></p>    
        <p><strong>Price:</strong> <span class="order-name">${postingPrice}</span></p>         
        <p>We will notify you once your order is shipped. If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Best regards,<br>EASYDROP SHIP</p>
        <div class="footer">
            <p>&copy; 2024 EASYDROP SHIP. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
const SendMAil=async(htmlText,response,sub,text)=>{
    let mailRequest=await axios.post("/apis/sendMail",{
      EmailAddress:`${shipperEmail}`,
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

const DoesuserDataExists=async(id)=>{
    const ref=collection(db,"usersPlacedOrders");
    const DataSnapshot=await getDocs(ref)
    const data=DataSnapshot.docs.map(doc => doc.id)
    // console.log(data)
    let DataExists=false;
    for(let item of data){
        if (JSON.stringify(item) === JSON.stringify(id)){
            DataExists=true
            break;
        }else{
            DataExists=false
            continue
        }
    }
    
    return DataExists
}

const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};
const removeFrompending=async(EmailID)=>{
    try{
    let pendingOrder=await getDoc(doc(db,"pendingOrders",`${EmailID}`))
    let ordersData=pendingOrder.data().orders
    let updatedOrders=ordersData.filter((item)=>{
        return item.ID !== ID
    })
    if(updatedOrders.length === 0){
        try{
        await deleteDoc(doc(db,"pendingOrders",`${EmailID}`))
        return true
    }catch(error){
        console.log("adminOrdersummary/52",error)
        return false
    }
    }
    await updateDoc(doc(db,"pendingOrders",`${EmailID}`),{
        orders:updatedOrders
    })

    return true
}catch(error){
    toast.error("Error placing order please try again")
    return false
    }
}
const handleSubmit = async(e) => {
    e.preventDefault();
    setOverLayLoading(true)
    if(await DoesuserDataExists(shipperEmail)){
        const docRef=doc(db,"usersPlacedOrders",`${shipperEmail}`)
        const doceRef2=doc(db,"placedOrders",`${shipperEmail}${Date.now()}`)
        const data={
            ID,
            time:Date.now(),
            postingAddress,
            customerEmail,
            customerMobile,
            postingName,
            customerName,
            zip,
            city,
            postingState,
            postingPrice,
            Total:parseInt(Total),
            status:"placed",
            Items,
            shipperEmail,
            TrackingDetails:{
                ...formData
            }
        }
        try{
            await updateDoc(docRef,{
                placedOrders:arrayUnion(data)
            })
            await setDoc(doceRef2,data)

         if (await removeFrompending(shipperEmail)){
            let mailReq=await SendMAil(placedOrderdMail,"placed  order mail sent","Order Placed","Order is placed");
            if(mailReq === "placed  order mail sent"){
                setOverLayLoading(false)
                router.replace("/admin/placed-orders")
                toast.success("Order placed")
            }else{
                setOverLayLoading(false)
                console.log(mailReq)
                 router.replace("/admin/placed-orders")
                toast.success("Order placed!,But unable send Email to dropshipper")
            }
            
         }else{
            setOverLayLoading(false)
            console.log("adminOrderSummmary/96",err)
            toast.error("unable to place order please try later")
            return

         }

        }catch(err){
            setOverLayLoading(false)
            console.log("adminOrderSummmary/100",err)
            toast.error("unable to place order please try later")
        }

    }else{
        setOverLayLoading(true)
        const docRef=doc(db,"usersPlacedOrders",`${shipperEmail}`)
        const doceRef2=doc(db,"placedOrders",`${shipperEmail}${Date.now()}`)
        const data={
            ID,
            time:Date.now(),
            postingAddress,
            customerEmail,
            customerMobile,
            postingName,
            customerName,
            city,
            postingState,
            postingPrice,
            Total,
            status:"placed",
            Items,
            shipperEmail,
            TrackingDetails:{
                ...formData
            }
        }
        const userStorgaeData={
            placedOrders:[
                data
            ]
        }
        try{
        await setDoc(docRef,userStorgaeData)
        await setDoc(doceRef2,data)
        
        setShowDialog(false);
        setFormData({ company: '', trackingID: '' })
        if (await removeFrompending(shipperEmail)){

            let mailReq=await SendMAil(placedOrderdMail,"placed  order mail sent","Order Placed","Order is placed");
            if(mailReq === "placed  order mail sent"){
                setOverLayLoading(false)
                router.replace("/admin/placed-orders")
                toast.success("Order placed")
            }else{
                setOverLayLoading(false)
                console.log(mailReq)
                 router.replace("/admin/placed-orders")
                toast.success("Order placed!,But unable send Email to dropshipper")
            }
            
         }else{
            setOverLayLoading(false)
            console.log("adminOrderSummmary/96",err)
            toast.error("unable to place order please try later")
            return

         }
        return
        }catch(err){
            setOverLayLoading(false)
            toast.error("Error Placing order please try again")
            console.log("ERROR:Adminordersummary/142 ",err)
        }
        
    }
    
    console.log(formData);
    setShowDialog(false);
};

let DeleteOrder=async()=>{
    setOverLayLoading(true)
await removeFrompending(shipperEmail)
let mailReq=await SendMAil(DeleteOrderedMail,"order delete mail sent","Order Deleted","Order is Deleted")
if(mailReq === "order delete mail sent"){
    setOverLayLoading(false)
    router.replace("/admin/placed-orders")
    toast.success("Order Deleted")
}else{
    console.log(mailReq)
    setOverLayLoading(false)
     router.replace("/admin/placed-orders")
    toast.success("Order Deleted!,But unable send Email to dropshipper")
}

}

return (
    <>
    {isOverlayLoading && <LoadingOverlay/>}
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
            <div className="flex justify-start item-start space-y-2 flex-col ">
                <Link href={"/"}> <h2 className="text-3xl lg:text-3xl font-semibold leading-7 lg:leading-9  text-gray-800 hover:underline">{shipperEmail}</h2></Link>
                <h3 className="text-2xl lg:text-2xl font-semibold leading-7 lg:leading-9  text-gray-800">Order #{ID}</h3>
                <p className="text-base font-medium leading-6 text-gray-600">{time}</p>
            </div>
            <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                        <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">Customer’s Cart</p>
                        {
                          Items && Items.map((e)=>{
                                return(
                           <div className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full " key={e.productId}>
                           
                            <div className="pb-4 md:pb-8 w-full md:w-40 cursor-pointer">
                                <Image className="w-full hidden md:block" src={e.imageSrc} alt="product image" height={500} width={500} />
                                
                            </div>
                            <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
                                <div className="w-full flex flex-col justify-start items-start space-y-8">
                                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">{e.productName}</h3>
                                    <div className="flex justify-start items-start flex-col space-y-2">
                                        <p className="text-sm leading-none text-gray-800">
                                            <span className="text-gray-300">Vendor: </span>   {e.vendor}
                                        </p>
                                        
                                    </div>
                                </div>
                                <div className="flex justify-between space-x-8 items-start w-full">
                                    <p className="text-base xl:text-lg leading-6">
                                        Rs {e.price}/-
                                    </p>
                                    <p className="text-base xl:text-lg leading-6 text-gray-800">{e.quantity}</p>
                                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">Rs {parseInt(e.price) * parseInt(e.quantity)}/-</p>
                                </div>
                            </div>
                            
                        </div>
    )})   
                    }



                    </div>
                    <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Summary</h3>
                            <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200  pb-4">
                                <div className="flex justify-between border-b pb-4 w-full">
                                    <p className="text-base leading-4 text-gray-800">Dropshipper Price</p>
                                    <p className="text-base leading-4 text-gray-600">Rs {postingPrice}/-</p>
                                </div>
                               
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-base leading-4 text-gray-800">Shipping</p>
                                    <p className="text-base leading-4 text-gray-600">Rs 250/-</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b pb-4 w-full">
                            <p className="text-base leading-4 text-gray-800">Total</p>
                            <p className="text-base leading-4 text-gray-600">Rs {Total}/-</p>
                            </div>

                            <div className="flex justify-between items-center w-full">
                                <p className="text-base font-semibold leading-4 text-gray-800">Grand Total</p>
                                <p className="text-base font-semibold leading-4 text-gray-600">Rs {parseInt(Total) + 250}/-</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                            <h3 className="text-xl font-semibold leading-5 text-gray-800">Status</h3>
                          
                            <div className="w-full flex justify-center items-center">
                                <button   className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">{status}</button>
                            </div>

                            <div className="w-full flex flex-col justify-center items-center">
                                <button  onClick={() => setShowDialog(true)} className="hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-800 py-5 w-96 md:w-full bg-green-800 text-base font-medium leading-4 text-white">Place Order</button>
                            </div>
                            <div className="w-full flex justify-center items-center">
                                <button className="hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 py-5 w-96 md:w-full bg-red-600 text-base font-medium leading-4 text-white" onClick={DeleteOrder}>Delete Order</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col ">
                    <h3 className="text-xl font-semibold leading-5 text-gray-800">Customer</h3>
                    <div className="flex  flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0 ">
                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                           

                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4  border-gray-200 w-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 7L12 13L21 7" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{customerEmail}</p>
                            </div>

                            <div className="flex justify-center  md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.62 10.79C8.06 13.71 10.29 15.94 13.21 17.38L15 15.59C15.16 15.42 15.39 15.36 15.6 15.41C16.67 15.67 17.8 15.83 18.99 15.83C19.55 15.83 20 16.28 20 16.84V20C20 20.55 19.55 21 19 21C9.61 21 3 14.39 3 5C3 4.45 3.45 4 4 4H7.16C7.72 4 8.17 4.45 8.17 5.01C8.17 6.2 8.33 7.33 8.59 8.4C8.64 8.61 8.58 8.84 8.41 9L6.62 10.79Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                                <p className="cursor-pointer text-sm leading-5 text-gray-800">{customerMobile}</p>
                            </div>
                        </div>
                        <div className="flex justify-between xl:h-full  items-stretch w-full flex-col mt-6 md:mt-0">
                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row  items-center md:items-start ">
                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 xl:mt-8">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{postingAddress}</p>
                                </div>
                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 ">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Customer Name</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{customerName}</p>
                                </div>
                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 ">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">Dropshipper posting  Name</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{postingName}</p>
                                </div>

                                <div className="flex justify-center md:justify-start  items-center md:items-start flex-col space-y-2 ">
                                    <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">City/state/zip</p>
                                    <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{city}/{postingState}/{zip}</p>
                                </div>

        
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {showDialog && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-6">Place Order</h3>
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium">Delivery Company</label>
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium">Tracking ID</label>
                <input
                    type="text"
                    name="trackingID"
                    value={formData.trackingID}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="flex space-x-4">
                <button type="submit" className="py-3 px-6 bg-green-500 text-white rounded-lg text-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700">Submit</button>
                <button type="button" onClick={() => setShowDialog(false)} className="py-3 px-6 bg-gray-500 text-white rounded-lg text-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700">Cancel</button>
            </div>
        </form>
    </div>
</div>


)}
        </>    
    );
};

export default OrdersumAdmin;
