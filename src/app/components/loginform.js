"use client"
import {useState} from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore,getDoc,doc } from "firebase/firestore";
import { app } from "@/app/_private/firebaseConfig";
import { useRouter } from "next/navigation";
import { addUser } from "../statemanagement/slices/userSlice";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import Link from "next/link";
import Image from "next/image";
import LoadingOverlay from "./bottomLoader";
export default function Func(){
const [userData,setUserData]=useState({});
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
const [passwordVisible, setPasswordVisible] = useState(false);
const [isLoading,setIsloading]=useState(false)

const togglePasswordVisibility = () => {
  setPasswordVisible(!passwordVisible);
};
const auth=getAuth(app);
const db=getFirestore(app);
const docRef=doc(db,"admins","adminmails")
const dispatch=useDispatch();
const router=useRouter();
 const changHandle=(e)=>{
  const {name , value} = e.target;
  setUserData((prevState)=>({
    ...prevState,
    [name]:value
}));
 };
  const submitForm=async (e)=>{
    setIsloading(true)
    e.preventDefault();
    let userDataLength=Object.keys(userData).length;
  if(userDataLength === 0){
    setIsloading(false)
    toast.error("Enter required information");
    return
  }
  if(userDataLength !==0 && (userData.Password === undefined || userData.Password.length < 8)){
    setIsloading(false)
    
    toast.error("Please provide required information\nEnter Password")

    return
    }

    if(userDataLength !==0 && userData.Email === undefined){
    setIsloading(false)
      
      toast.error("Please provide required information\nEnter Email")
      return
      }
      try{
      const userCredential = await signInWithEmailAndPassword(auth, userData.Email, userData.Password);
      console.log("user: ", userCredential.user.email)
      const docSnap = await getDoc(docRef);
      const mails=docSnap.data().gmail;
      let isAdmin=mails.includes(userCredential.user.email)
      let usersStateData={
        Email: userCredential.user.email,
         uID:userCredential.user.uid,
         login:true,
         isAdmin:isAdmin
       }
       dispatch(addUser(JSON.stringify(usersStateData)))
       let encData=CryptoJS.AES.encrypt(JSON.stringify(JSON.stringify(usersStateData)),secretKey).toString();
       localStorage.setItem("ADS",encData)
       console.log("data Written")
      setIsloading(false)
      
       console.log(usersStateData)
        router.replace("/")
      return
    }catch(error){
    setIsloading(false)
      
      toast.error(error.code)
    }
  };
    return(
    <>
    {isLoading && <LoadingOverlay/>}
     <div className="bg-gray-100 flex justify-center items-center h-screen">
  {/* Left: Image */}
  <div className="w-1/2 h-full hidden lg:block">
    <div className="relative w-full h-full">
      <Image
        src="/login4.jpg" // Replace with your image path
        alt="Placeholder Image"
        layout="fill"
        objectFit="cover"
        priority
      />
    </div>
  </div>
  {/* Right: Login Form */}
  <div className="w-full max-w-xs my-auto mx-auto lg:w-1/2 p-4">
    <div className="text-center mb-6">
      <Link href={"/"}>
      <h1 className="text-2xl font-bold text-emerald-500 underline">Easy Dropship</h1>
      </Link>
    </div>
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submitForm}>
      <h2 className="text-xl font-bold text-emerald-500 mb-4 text-center">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Email">
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="Email"
          name="Email"
          type="email"
          required
          placeholder="Email"
          onChange={changHandle}
        />
      </div>
      <div className="mb-6 relative">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="Password"
          id="password"
          required
          type={passwordVisible ? "text" : "password"}
          onChange={changHandle}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-9 text-emerald-500 hover:text-emerald-700"
        >
          {passwordVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A7.5 7.5 0 005.28 10.5M10.5 5.28a7.5 7.5 0 018.325 8.325M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12c0 1.657-1.343 3-3 3S9 13.657 9 12s1.343-3 3-3 3 1.343 3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.29 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-4.832 7-9.542 7s-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign In
        </button>
      </div>
      <p className="text-center text-gray-500 text-xs mt-3">
        Don’t have an account?
        <Link href="/signup">
          <span className="font-bold text-sm text-emerald-500 hover:text-emerald-700 hover:underline mx-1">
            Signup
          </span>
        </Link>
      </p>
    </form>
    <p className="text-center text-gray-500 text-xs">
      &copy;2024 Easy Dropship. All rights reserved.
    </p>
  </div>
</div>


</>
    )
}