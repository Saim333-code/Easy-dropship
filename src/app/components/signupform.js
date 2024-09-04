"use client"
import {useState} from "react";
// import { Toast } from "react-toastify/dist/components";
import { toast } from 'react-toastify';
import axios from "axios";
import LoadingOverlay from "./bottomLoader";
import { useRouter } from "next/navigation";
export default  function Signup(){
  let [userData,setUserData]=useState({});
  let [error,setError]=useState(" ");
  const [isLoading,setIsloading]=useState(false)
  let changeHandle= (e)=>{
   const {name , value} = e.target;
    setUserData((prevState)=>({
      ...prevState,
      [name]:value
  }));
  };
  const router=useRouter();
const SubmitForm=async (e)=>{
  setIsloading(true)
  e.preventDefault();
  let userDataLength=Object.keys(userData).length;
  if(userDataLength === 0){
    toast.error("Enter required information");
    setIsloading(false)
    return
  }
  if(userDataLength !==0 && (userData.Password === undefined || userData.Password.length < 8)){
    setIsloading(false)
    toast.error("Please provide required information")
    setError(`password should be atleast of 8 character`);
    return
    }
  if(userData.Password !== userData.confirmPassword){
    setIsloading(false)
    toast.error("Please provide required information")
    setError(`password and confirm password must be same`);
    return
  }

  if(userData.Cnic === undefined || userData.Cnic.length< 13 ){
    setIsloading(false)
    toast.error("CNIC is not valid");
    return
  }
  if(userData.Mobile === undefined || userData.Mobile.length < 11 || userData.Mobile.length > 11){
    setIsloading(false)
    toast.error("Mobile number is not valid");
    return
  }
  // console.log("end");
  // await addUserData(userData)
  console.log(userData);
  let data=await axios.post("/apis/signup",userData);
  // console.log(data.data);
  if(data.data.Success==="Error"){
    setIsloading(false)
    toast.error(data.data.Result)
    return
  }
  if(data.data.Success === "Got it"){
    setIsloading(false)
 
  console.log("After 5000s")
  router.replace('/');
  toast.success(data.data.Result);
}
  // return
};
    return(
    <>
    {isLoading && <LoadingOverlay/>}
    <div className="border border-black">
<div className="p-10 ">
<h1 className="text-4xl font-extrabold text-center mb-8 text-emerald-500 underline">Easy Dropship</h1>
<h2 className="mb-8 font-extrabold text-3xl text-emerald-500">Register</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          required
          placeholder="Full Name"
          name="Name"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Email"
          type="email"
          required
          placeholder="example@gmail.com"
          name="Email"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Address">
          Address
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Address"
          type="text"
          placeholder="Address"
          required
          name="Address"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Cnic">
          Cnic
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Cnic"
          type="text"
          required
          placeholder="Cnic without dashes"
          name="Cnic"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Mobile">
          Mobile Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Mobile"
          type="text"
          required
          placeholder="Mobile Number"
          name="Mobile"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Brandname">
          Brand Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Brandname"
          required
          type="text"
          placeholder="Your brand name"
          name="Brandname"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Bank">
          Bank Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Bank"
          type="text"
          required
          placeholder="Bank Name"
          name="Bank"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="CardName">
          Name on card
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="CardName"
          type="text"
          required
          placeholder="Cardholder name"
          name="Cardname"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Accountnumber">
          Bank Account Number
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Accountnumber"
          required
          type="text"
          placeholder="IBAN number"
          name="BankAccountNumber"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
          id="password"
          type="password"
          placeholder="Enter your password"
          name="Password"
          onChange={(e) => changeHandle(e)}
        />
        {error !== " " && <p className="text-red-500 text-xs italic">{error}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Confirmpassword">
          Confirm Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
          id="Confirmpassword"
          type="password"
          name="confirmPassword"
          placeholder="Enter your password"
          onChange={(e) => changeHandle(e)}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={(e) => SubmitForm(e)}
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign up
        </button>
        <p className="inline-block align-baseline mx-2">
          Have an Account?
          <a
            className="font-bold text-sm text-emerald-500 hover:text-emerald-700 hover:underline mx-1"
            href="/login"
          >
            Login
          </a>
        </p>
      </div>
    </form>

    <aside className="relative bg-gray-100 p-6 rounded hidden md:block">
      <div className="absolute inset-0">
      <div
  className="w-full h-full bg-no-repeat bg-left-top bg-cover"
  style={{ backgroundImage: "url('/signup3.jpg')" }}
></div>

      </div>
      <div className="relative z-10 flex items-center justify-center w-full h-full text-center">
  <div
    className="text-dark bg-white bg-opacity-50 p-8 rounded"
  >
    <h2 className="font-bold text-xl mb-4">Instructions</h2>
    <ul className="list-disc mt-4 list-inside text-sm">
      <li>All users must provide a valid email address and password to create an account.</li>
      <li>Users must not use offensive, vulgar, or otherwise inappropriate language in their username or profile information.</li>
      <li>Users must not create multiple accounts for the same person.</li>
    </ul>
  </div>
</div>

    </aside>

  </div>
</div>
</div>
</>
    )
}