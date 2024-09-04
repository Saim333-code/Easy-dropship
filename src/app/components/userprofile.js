"use client"
import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import { app } from "../_private/firebaseConfig";
import { toast } from "react-toastify";
import { addUser } from "../statemanagement/slices/userSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const loginState=useSelector((data)=>data.userData);
    const auth=getAuth(app);
    const dispatch=useDispatch();
    const router=useRouter();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
const Signoutuser=async()=>{
    try {
        await signOut(auth)
        const usersStatedata={
            Email: undefined,
             uID:undefined,
             login:false,
             isAdmin:false
           }
          dispatch(addUser(JSON.stringify(usersStatedata))) 
          localStorage.removeItem("ADS")
          window.location.replace("/")
        toast.success("Signed out successfully")
    } catch (error) {
        // window.location.replace("/")
        router.replace("/")
        toast.error("Error signing out")
    }
return
}
  return (
    <>
<div className="relative inline-block text-center mx-10">
  <div className="">
    <button
      onClick={toggleDropdown}
      className="py-0 px-2 inline-flex items-center justify-center w-full rounded-full border border-gray-300 shadow-sm  -my-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg
        className="rounded-full h-8 w-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
          clipRule="evenodd"
        />
      </svg>
      <svg
        className={`ml-2 h-5 w-5 transform transition-transform duration-200 ease-in-out ${isOpen ? "rotate-180" : ""}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 010-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>

  {isOpen && (
    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <p
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
        >
          {loginState.Email}
        </p>
        <Link
          href={"/dashboard"}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
        >
          Dashboard
        </Link>
        <Link
          href={"/orders"}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          role="menuitem"
        >
          Orders
        </Link>
      
        <button
          className="inline px-4 py-2 text-md text-white bg-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 rounded-md transition-colors duration-150 ease-in-out"
          role="menuitem"
          type="button"
          onClick={Signoutuser}
        >
          Sign out
        </button>
      </div>
    </div>
  )}
</div>



    </>
  );
};

export default Dropdown;
