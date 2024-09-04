"use client"
import Verticalnav from "../components/verticalnav";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
export default function Home() {
    const state=useSelector(data=>data.userData)
    const router=useRouter();
    if(state.isAdmin === false){
        router.push("/")
    }
    return (
        <>
        {state.isAdmin &&
        <Verticalnav/>
    }
        </>
    );
  }
  