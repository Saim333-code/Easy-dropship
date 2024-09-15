"use client"
import Link from "next/link";
import { useState,useEffect } from "react";
import { usePathname,useRouter } from 'next/navigation';
import { onAuthStateChanged,getAuth } from "firebase/auth";
import { app } from "../_private/firebaseConfig";
import { addUser } from "../statemanagement/slices/userSlice";
import { getFirestore,getDoc,doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import   Component  from "./userprofile";
import CryptoJS from "crypto-js";
export default function Navbar() {
  let [navbarOpen, setNavbarOpen] = useState(false);
  const pathname=usePathname();
  const auth=getAuth(app);
  const db=getFirestore(app)
  const dispatch=useDispatch();


 
  let login=false;
  
 const loginState=useSelector((data)=>{

  return data.userData
   
  })
  useEffect(()=>{
    // console.log(pathname)
    const unsubscribe=onAuthStateChanged(auth,(userInfo)=>{
      if(userInfo && !loginState.login){
        const X_y_z = localStorage.getItem("ADS");
        if (!X_y_z) return null;
       let bytes=CryptoJS.AES.decrypt(X_y_z,process.env.NEXT_PUBLIC_SECRET_KEY)
        const dopmaine=bytes.toString(CryptoJS.enc.Utf8)
        const ds=JSON.parse(JSON.parse(dopmaine))
        dispatch(addUser(JSON.stringify(ds)))
       return
      }else{
        return
      }
    })
    
    return async()=>{
      unsubscribe()
    }
  },[]);



  return (
    <>
{pathname !== "/login" && (
  <nav className="sticky top-0 z-50 bg-emerald-500 p-4">
    <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
      <Link className="text-lg font-bold text-white uppercase" href="/">
      <h3
      role="heading"
      aria-level="3"
      id="logo-text-3214"
      data-ux="LogoHeading"
      data-aid="HEADER_LOGO_TEXT_RENDERED"
      headertreatment="Fill"
      fontscalemultiplier="0.8"
      data-typography="LogoAlpha"
      data-font-scaled="true"
      className="custom-letter-spacing font-norwester"
    >
      Easy Dropship
    </h3>
      </Link>
      <div className="flex items-center w-full lg:w-auto">
        <button
          className="lg:hidden absolute top-[1rem] text-white focus:outline-none"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          {navbarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 inline-block"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 inline-block"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
        <div
          className={`lg:flex flex-col lg:flex-row items-center w-full lg:w-auto ${
            navbarOpen ? "flex" : "hidden"
          } mt-4 lg:mt-0`}
        >
          <ul className="flex flex-col gap-[0.7rem] lg:flex-row lg:gap-1 list-none lg:ml-auto">
            {pathname !== "/signup" && !loginState.login && (
              <li className="nav-item">
                <Link
                  className="px-3 py-2 text-white hover:bg-emerald-600 rounded lg:mx-2"
                  href="/login"
                >
                  Login/signup
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                className="px-3 py-2 text-white hover:bg-emerald-600 rounded lg:mx-2"
                href="/products"
              >
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="px-3 py-2 text-white hover:bg-emerald-600 rounded lg:mx-2"
                href="/cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 inline-block"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a1 1 0 0 0 1 0.61h12.72a1 1 0 0 0 1-.78l3.18-11.37H6.13" />
                </svg>
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link
                className="px-3 py-2 text-white hover:bg-emerald-600 rounded lg:mx-2"
                href="/services"
              >
                Other services
              </Link>
            </li> */}
            {loginState.isAdmin && (
              <li className="nav-item">
                <Link
                  className="px-3 py-2 text-white hover:bg-emerald-600 rounded lg:mx-2"
                  href="/admin"
                >
                  Admin Portal
                </Link>
              </li>
            )}
            {loginState.login && !loginState.isAdmin && (
              <li className="nav-item">
                <Component />
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  </nav>
)}



    </>
  );
}

