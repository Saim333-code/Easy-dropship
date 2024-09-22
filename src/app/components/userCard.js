"use client"
import axios from "axios"
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoadingOverlay from "./bottomLoader";
export default function Usercard(param){
    const router=useRouter();
    const [securityFee,setSecurityfee]=useState(0);
    const [isLoading,setIsLoading]=useState(false);
    const state=useSelector(data=>data.userData);
    if(state.isAdmin === false){
        router.replace("/")
    }
    console.log(param)
    const {id}=param
    const {Name,Email,Mobile,Brandname,Cnic,Address,Bank,BankAccountNumber,Cardname,Password,question1,question2,question3}=param.params
    const postParams={
        Email,
        Password,
        id,
        Mobile,
        Brandname,
        Cnic,
        Address,
        Bank,
        BankAccountNumber,
        Cardname,
        Name,
        Security:securityFee,
        cart:[],
        method:"verify"
    }
    const DelParams={
        method:"Delete",
        "id":id
    }
    const verifyUser=async ()=>{
        setIsLoading(true)
        console.log("I am clicked")
      const signUserup=await axios.post("/apis/verify",postParams);
        if(signUserup.data.Result === "Success"){
            toast.success("User is signed up successfully");
            setIsLoading(false)
            window.location.replace('/users');
            return
        }
        if(signUserup.data.Result === "Failure"){
            setIsLoading(false)
            toast.error("Email Already in use")
            return
        }   }
    
    console.log(postParams)

    const DeleteUser=async ()=>{
        const DelUser=await axios.post("/apis/verify",DelParams);
        // console.log(DelUser.data.Result)
        if(DelUser.data.Result === "Deleted User"){
            toast.success("User is Deleted successfully");
            router.replace('/users');
            return
        }
        if(DelUser.data.Result === "Fail to delete"){
            toast.error("Unable to Delete")
            return
        }  
    }
    useEffect(()=>{
        if(state.isAdmin === false || state.login === false ){
            router.replace("/")
        }
    })
    return (
        <>
        {isLoading && <LoadingOverlay/>}
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        User database
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Details and information about the user.
      </p>
    </div>
    <div className="border-t border-gray-200">
      <dl>
        {/* User details section */}
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">ID</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{id}</dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Full name</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Name}</dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Email</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Email}</dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Mobile</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Mobile}</dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Brand Name</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Brandname}</dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">CNIC</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Cnic}</dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Address</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Address}</dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Bank</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Bank}</dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Card Holder Name</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{Cardname}</dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">Bank Account Number</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{BankAccountNumber}</dd>
        </div>

        {/* Display answers to the three questions */}
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">What&apos;s a dropshipper&apos;s responsibility in dropshipping?</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{question1}</dd>
        </div>
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500"> {"Who is responsible to provide the customer for order confirmation call, order dispatchment & tracking details?( Dropshipper OR Easydropship)"}</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{question2}</dd>
        </div>
        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500">If there are increasing numbers of returns, what would you as a Dropshipper try to resolve and minimize return orders ?</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{question3}</dd>
        </div>

        {/* Security fees input */}
        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <label htmlFor="fees" className="text-gray-700 font-semibold">
            Security Fees
          </label>
          <input
            type="number"
            id="fees"
            placeholder="Security Fees"
            className="
              w-full
              px-4
              py-2
              border
              border-gray-300
              rounded-lg
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              transition
              duration-300
              ease-in-out
              bg-white
              text-gray-900
              placeholder-gray-400
            "
            onChange={(e) => setSecurityfee(e.target.value)}
          />
        </div>
      </dl>
    </div>

    {/* Buttons */}
    <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-gray-50 flex justify-center space-x-4">
      <button
        onClick={verifyUser}
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Verify
      </button>
      <button
        type="button"
        onClick={DeleteUser}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </div>
</div>

        </>
    );
}
// {
//     "params": {
//         "Address": "islamabad,pakistan",
//         "BankAccountNumber": "svsvsfvfsv",
//         "Mobile": "03124565987",
//         "Password": "12345678",
//         "Cardname": "dcsdcdvsv",
//         "Email": "owdjy9fkl2@expressletter.net",
//         "Bank": "dfsdfsms",
//         "Cnic": "1234567899876",
//         "Brandname": "vcdjf",
//         "confirmPassword": "12345678",
//         "Name": "ui test"
//     },
//     "id": "nkSVXVdzYgYnAqsx6U6D"
// }