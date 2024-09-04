import { NextRequest, NextResponse } from "next/server";
import { app } from "@/app/_private/firebaseConfig"; 
import {doc, getFirestore,getDoc } from "firebase/firestore";

export  async function GET(req){
    const db=getFirestore(app);
    console.log("api got hit")
    const url=new URL(req.url)
    const searchParams=new URLSearchParams(url.searchParams)
    const docRef = doc(db, "users", searchParams.get("id"));
    const data = await getDoc(docRef);
    if(!data.exists()){
        return  NextResponse.json({
            Result:"Failed to get data"
        },{
            status:400
        })
    }
    // console.log("id :",searchParams.get("id"))
    // console.log(data.data());
    const user=data.data();
    const id=searchParams.get("id")
    return  NextResponse.json({
        Result:user
    },{
        status:201
    })
}