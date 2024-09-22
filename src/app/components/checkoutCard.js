"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector,useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Image from "next/image"
import { app } from "../_private/firebaseConfig"
import { getFirestore,collection,addDoc,doc,setDoc,getDoc,getDocs,updateDoc, arrayUnion } from "firebase/firestore"
import axios from "axios"
import BasicLoader from "./basicLoader"
import LoadingOverlay from "./bottomLoader"
import ErrorPopup from "./errorpopup"
import Successpopover from "./successpop"
export default function CheckOutCARD(props){
    const router=useRouter();
    const {stateToRead}=props;
    const loginState=useSelector((data)=>data.userData)
    const orderState=useSelector(data=>data.order)
    const cartState=useSelector((data)=>data.cart)
    let sideProductsData=[];
    const [orderdetails,setOrderdetials]=useState({});
    const [DeliveryPrice,setDeliveryPrice]=useState(0)
    const [isLoading,setIsloading]=useState(false)
    const [overLayLoading,setOverLAyloading]=useState(false)
    const [showError,setShowError]=useState(false)
    const [showSuccess,setShowsuccess]=useState(false)
    const [errorText,setErrortext]=useState('')
    const hasUnsavedChanges = true;
    
    useEffect(()=>{
      if(loginState.login === false){
          router.replace("/login")
      }
      async function getDeliveryPrice(){
        setIsloading(true)
        const docRef=doc(db,"Delivery","info")
        let DeliveryData=await getDoc(docRef)
        if(DeliveryData.exists()){
          setDeliveryPrice(parseInt(DeliveryData.data().Charges))
          setIsloading(false)
          return
        }else{
          setDeliveryPrice(0)
          setIsloading(false)
          return
        }
      }
      getDeliveryPrice()
  },[loginState])
  useEffect(()=>{
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        event.preventDefault();
        event.returnValue = message; // Standard way to set the message
        return message; // For some older browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]); // Dependency array includes `hasUnsavedChanges`

  const handleCloseError=()=>{
    setOverLAyloading(false)
    setShowError(false)
  }
  const handleShopMore=()=>{
    setShowsuccess(false)
  }
    const SendMAil=async()=>{
      let mailRequest=await axios.post("/apis/sendMail",{
        EmailAddress:`${loginState.Email}`,
        Text:"Order is Pending",
        Subject:"Pending Order",
        Html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We Received Your Order!</title>
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
        <h1 style="color: green">We Received Your Order!</h1>
        <p>Thank you for your order with EASYDROP SHIP! We are pleased to confirm that we have received your order, and it will be placed soon.</p>
        <p><strong>Customer Name:</strong> <span class="order-name">${orderdetails.customerName}</span></p>
        <p><strong>Time:</strong> <span class="order-name">${new Date().toLocaleString()}</span></p>    
        <p><strong>Price:</strong> <span class="order-name">Rs ${orderdetails["shipmentPrice"]}/-</span></p>    

        <p>We will notify you once your order is placed and shipped. If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Best regards,<br>EASYDROP SHIP</p>
        <div class="footer">
            <p>&copy; 2024 EASYDROP SHIP. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        ReturnResponse:"pending order mail sent"
  
      },{
          headers: {
            'Content-Type': 'application/json'  
          }
    })
    return mailRequest.data.message
    }

    const sendAdminEmail=async()=>{
      let mailRequest=await axios.post("/apis/sendMail",{
        EmailAddress:`hammad63291@gmail.com`,
        Text:" Got An Order",
        Subject:"Got order",
        Html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You got an Order!</title>
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
        <h1 style="color: green">You Received a Order!</h1>
        <p>You recieved a order from.</p>
        <p><strong>Customer Name:</strong> <span class="order-name">${loginState.Email}</span></p>
        <p><strong>Time:</strong> <span class="order-name">${new Date().toLocaleString()}</span></p>    
        <p><strong>Price:</strong> <span class="order-name">Rs ${orderdetails["shipmentPrice"]}/-</span></p>    

        <p>HURRRAH!</p>
        <p>Best regards,<br>EASYDROP SHIP</p>
        <div class="footer">
            <p>&copy; 2024 EASYDROP SHIP. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
        ReturnResponse:"pending order mail sent"
  
      },{
          headers: {
            'Content-Type': 'application/json'  
          }
    })
    return mailRequest.data.message
    }




    if(!loginState.login){
      router.replace("/products")
    }
    let totalPrice=0;
    // const ProductOrderState=useSelector((data)=>data.order);
    const db=getFirestore(app)
    // const dispatch=useDispatch();
    let changeHandle= (e)=>{
        const {name , value} = e.target;
         setOrderdetials((prevState)=>({
           ...prevState,
           [name]:value
       }));
    }

    if(stateToRead === "productchekout"){
        sideProductsData=[];
        sideProductsData=orderState.products
        if(sideProductsData.length === 0){
          return
        }
        totalPrice=parseInt(sideProductsData[0].price) * parseInt(sideProductsData[0].quantity)
    }else if(stateToRead === "cartCheckout"){
      sideProductsData=[];
      sideProductsData=cartState;
      totalPrice=sideProductsData.reduce((acc,it)=>{
        return acc+(parseInt(it.quantity)*parseInt(it.price));
      },0)
    }
    // console.log("sideproductsData: ",sideProductsData)
    const createOrder=async(orderId,data)=>{
       await setDoc(doc(db,"pendingOrders",`${orderId}`),data,{merge:true})
       let mailResp=await SendMAil()
       if(mailResp === "pending order mail sent"){
      //  router.replace("/products")
      await sendAdminEmail()
      setOverLAyloading(false)
      setShowsuccess(true)

       toast.success("Order is placed for confirmation.you will  get confirmation mail when order is placed")
       }else{
        // router.replace("/products")
        setOverLAyloading(false)
        setShowsuccess(true)
       toast.success("Order is placed for confirmation.we are unable to send email!")
       }
        return 
    }
    const updateOrders=async(orderID,data)=>{
      const orderRef=doc(db,"pendingOrders",`${orderID}`)
      try{
        await updateDoc(orderRef,{
          orders:arrayUnion(data)
        })
       let mailResp=await SendMAil()
       if(mailResp === "pending order mail sent"){
        // router.replace("/products")
        await sendAdminEmail()
        setOverLAyloading(false)
        setShowsuccess(true)
        toast.success("Order is placed for confirmation.you will  get confirmation mail when order is placed")
       }else{
        // router.replace("/products")
        setOverLAyloading(false)
        setShowsuccess(true)
        toast.success("Order is placed for confirmation.We are unable to send mail")
       }
      }catch(error){
        toast.error("error placing order please try again")
        console.log("Update order error checkoutCard.js/57: ",error)
      }
    }
    const checkClientorderexists=async(id)=>{
      const querySnapshot = await getDocs(collection(db, "pendingOrders"));
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      // console.log(orders)
      if(orders.length === 0){
        return false;
      }

      let itemisPresent=false;
      for(let item of orders){
          if(item.id === id){
            itemisPresent=true;
            break;
          }else{
            itemisPresent=false;
            continue
          }
      }
      return itemisPresent;
    }
    const submit=async ()=>{
      setOverLAyloading(true)
      // setShowError(true)
      // setShowsuccess(true)
      // return
      const getSecurityfee=await getDoc(doc(db,"securityfee","description"));
    const securityFee=parseInt(getSecurityfee.data().minimum)

    const userSecurityFee=await getDoc(doc(db,"verifiedUsers",`${loginState.Email}`));
    const usersFee=parseInt(userSecurityFee.data().Security);

    if(usersFee < securityFee){
      setOverLAyloading(false)
      toast.error("please recharge your security fee in order to process your order")
      return;
    }
      if(Object.keys(orderdetails).length === 0 || Object.keys(orderdetails).length < 8 ){
        setOverLAyloading(false)
        toast.error("Enter required information");
        setErrortext(`please provide all information.`)
          setShowError(true)
        return
    }
      let keycheck=false;
      for(let key in orderdetails){
        console.log(orderdetails[key])
        if(orderdetails[key] === undefined || !orderdetails[key]){
          
          setOverLAyloading(false)  
          toast.error("please provide the crrect inforfomation")
          setErrortext(`please provide ${key}.`)
          setShowError(true)
            keycheck=true
            break;
        }
    }
        if(keycheck === true){
          return
          }
    if(orderdetails.customerPhoneNumber.length < 11){
      setOverLAyloading(false)  
      toast.error("Invalid mobile number")
        return
    }
    if(parseInt(orderdetails.shipmentPrice) <= (totalPrice+DeliveryPrice)){
      setOverLAyloading(false)
      toast.error("Please Enter shipment price more than total price")
        return
    }
      let dataCheck= await checkClientorderexists(loginState.Email);
      if(dataCheck){
        if(stateToRead === "productchekout"){
        console.log(orderState)
          const orderDatadispatch={
                  ID:Date.now(),
                  customerName:orderdetails["customerName"],
                  postingAddress:orderdetails["Address"],
                  shipperEmail: loginState.Email,
                  postingName: orderdetails["ShipmentName"],
                  postingPrice: orderdetails["shipmentPrice"],
                  customerEmail: orderdetails["customerEmail"],
                  city:  orderdetails["city"],
                  postingState:  orderdetails["state"],
                  customerMobile:  orderdetails["customerPhoneNumber"],
                  Total:totalPrice,
                  status:"pending",
                  time:new Date(),
                  Items:orderState.products
          }
         await updateOrders(loginState.Email,orderDatadispatch)
         
          // router.replace("/")
         return
        }else if(stateToRead === "cartCheckout"){
         const orderDatadispatch={
            ID:Date.now(),
            customerName:orderdetails["customerName"],
            postingAddress:orderdetails["Address"],
            shipperEmail: loginState.Email,
            postingName: orderdetails["ShipmentName"],
            postingPrice: orderdetails["shipmentPrice"],
            customerEmail: orderdetails["customerEmail"],
            city:  orderdetails["city"],
            
            postingState:  orderdetails["state"],
            customerMobile:  orderdetails["customerPhoneNumber"],
            status:"pending",
            Total:totalPrice,
            time:new Date(),
            Items:[...cartState]
          
          } 
          await updateOrders(loginState.Email,orderDatadispatch)
      

          // router.replace("/")
          return
        }

      }else{
        if(stateToRead === "cartCheckout"){
        const orderDatadispatch={
          orders:[ {
                ID:Date.now(),
                 customerName:orderdetails["customerName"],
                 postingAddress:orderdetails["Address"],
                 shipperEmail: loginState.Email,
                 postingName: orderdetails["ShipmentName"],
                 postingPrice: orderdetails["shipmentPrice"],
                 customerEmail: orderdetails["customerEmail"],
                 city:  orderdetails["city"],
                 postingState:  orderdetails["state"],
                 customerMobile:  orderdetails["customerPhoneNumber"],
                 status:"pending",
                 Total:totalPrice,
                 time:new Date(),
                 Items:[...cartState]
           
               } 
             ]
               }
               createOrder(loginState.Email,orderDatadispatch)
         

              //  router.replace("/")
               return
              }else if(stateToRead === "productchekout"){

                  const orderDatadispatch={
                    orders:[{
                        ID:Date.now(),
                        customerName:orderdetails["customerName"],
                        postingAddress:orderdetails["Address"],
                        shipperEmail: loginState.Email,
                        postingName: orderdetails["ShipmentName"],
                        postingPrice: orderdetails["shipmentPrice"],
                        customerEmail: orderdetails["customerEmail"],
                        city:  orderdetails["city"],
                        postingState:  orderdetails["state"],
                        customerMobile:  orderdetails["customerPhoneNumber"],
                        Total:totalPrice,
                        status:"pending",
                        time:new Date(),
                        Items:orderState.products
                    }
                    ]
                  }
                  createOrder(loginState.Email,orderDatadispatch)
                  

                  // router.replace("/")
               return
              }
      }     
      return
       
    }
  

    return(
        <>
        
        {overLayLoading && <LoadingOverlay/>}
        { isLoading ? <BasicLoader/> : (
<div className="font-[sans-serif] bg-white">
      <div className="flex max-sm:flex-col gap-12 max-lg:gap-4 h-full">
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 sm:h-screen sm:sticky sm:top-0 lg:min-w-[370px] sm:min-w-[300px]">
          <div className="relative h-full">
            <div className="px-4 py-8 sm:overflow-auto sm:h-[calc(100vh-60px)]">
              <div className="space-y-4">
{
    sideProductsData.map((e)=>{
        return(
                <div className="flex items-start gap-4" key={ e.productId}>
                  <div className="w-32 h-28 max-lg:w-24 max-lg:h-24 flex p-3 shrink-0 bg-gray-300 rounded-md">
                    <Image
                     src={e.productImageURL || e.imageSrc}
                     alt="product image"
                     className="w-full object-contain" 
                     height={100}
                     width={200}
                    //  loader={loaderFunc()}
                     loading="lazy"

                     />
                  </div>
                  <div className="w-full">
                    <h3 className="text-base text-white">{e.productName}</h3>
                    <ul className="text-xs text-gray-300 space-y-2 mt-2">
                      <li className="flex flex-wrap gap-4">Quantity <span className="ml-auto">{e.quantity}</span></li>
                      <li className="flex flex-wrap gap-4">Total Price <span className="ml-auto">RS{(parseInt(e.quantity)*parseInt(e.price))} /-</span></li>
                    </ul>
                  </div>
                </div>
    )   
    })   
        }

              </div>
            </div>
            <div className="md:absolute md:left-0 md:bottom-0 bg-gray-800 w-full p-4">
            <h4 className="flex flex-wrap gap-4 text-base text-white">Shipment: <span className="ml-auto">Rs {DeliveryPrice}/-</span></h4>
            <h4 className="flex flex-wrap gap-4 text-base text-white">Total: <span className="ml-auto">Rs {totalPrice}/-</span></h4>
              <h4 className="flex flex-wrap gap-4 text-base text-white">Grand Total: <span className="ml-auto">Rs {totalPrice+DeliveryPrice}/-</span></h4>
            </div>
          </div>
        </div>

        <div className="max-w-4xl w-full h-max rounded-md px-4 py-8 sticky top-0">
          <h2 className="text-2xl font-bold text-gray-800">Complete your order</h2>
          <form className="mt-8">
            <div>
              <h3 className="text-base text-gray-800 mb-4">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input type="text" placeholder="Shipment Name" name="ShipmentName" required onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>

                <div>
                  <input type="text" placeholder="shipment price" name="shipmentPrice" required  onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>

                <div>
                  <input type="email" placeholder="customer Email" name="customerEmail" required onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>

                <div>
                  <input type="number" placeholder="Phone No." name="customerPhoneNumber" required onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>
                <div>
                  <input type="text" placeholder="CustomerName" name="customerName" required onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">Shipping Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input type="text" placeholder="Address Line" name="Address" required onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>
                <div>
                  <input type="text" placeholder="City" name="city" required onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>
                <div>
                  <input type="text" placeholder="Enter State" name="state" required onChange={(e)=>changeHandle(e)}
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600" />
                </div>
              
              </div>

              <div className="flex gap-4 max-md:flex-col mt-8">
                <button type="button" className="rounded-md px-6 py-3 w-full text-sm tracking-wide bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-800 max-md:order-1" onClick={()=>router.replace("/products")}>Cancel</button>
                <button type="button" className="rounded-md px-6 py-3 w-full text-sm tracking-wide bg-emerald-500 hover:bg-emerald-700 text-white" onClick={submit}>Complete Purchase</button>
              </div>
            </div>
          </form>
        </div>
      </div>
     
      {/* Error Popup */}
      {showError && (
        <ErrorPopup showError={showError} handleCloseError={handleCloseError} text={errorText}/>
      )}

      {/* Success Popup */}
      {showSuccess && (
      <Successpopover/>
      )}

    </div>
   ) }
        </>
    )
}
