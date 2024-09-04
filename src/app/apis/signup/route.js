//Api to used for storing up the userData in firestore
//users whihc are to be verified
import { NextResponse } from "next/server";
import { getFirestore,collection,addDoc } from "firebase/firestore";
import { app } from "@/app/_private/firebaseConfig";
// import { getFirestore, collection, addDoc } from "firebase/firestore";
// import { app } from "../_private/firebaseConfig";

export  async function POST(req){

    try{
         const db = getFirestore(app);
        const data=await req.json();
        if(Object.keys(data).length < 11){
            return NextResponse.json({
                Result:`Invalid Data`,
                Success:"Error"
            
            },{
                status:201
            })
        }
        let signupID;

        let userDetails={};
        Object.keys(data).forEach((e)=>{
            if(e === "Mobile"){
                let number=parseInt(data[e])
                userDetails[e]= (isNaN(number)) || (String(number).length < 10) || (String(number).length > 10 ) ? 'np' : data[e];
                return;
            }
            if(e === "Cnic"){
                let nic=parseInt(data[e])
                userDetails[e] = (isNaN(nic)) || (String(nic).length< 13) || (String(nic).length > 13) ? 'np' : data[e];
                   return
            }
            userDetails[e]=data[e] || 'np';
            
        })

        for(let key in userDetails){
            if(userDetails[key] === "np"){
                // console.log(userDetails)
                return NextResponse.json({
                    Result:`${key} is invalid`,
                    Success:"Error"
                
                },{
                    status:201
                })
            }
        }
        // console.log(userDetails)
        async function addUserData(userData) {
            try {
              // Reference to the "users" collection
              const usersCollectionRef = collection(db, "users");
          
              // Add a new document with the provided user data
              const docRef = await addDoc(usersCollectionRef, userData);
            //   console.log("Document written with ID: ", docRef.id);
            signupID=docRef.id;
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          }
          await addUserData(userDetails)
        //   console.log(fbresult.data)
        return NextResponse.json({
            Result:`Your information is submited for verification please remember this id: ${signupID}`,
            Success:"Got it"
        
        },{
            status:201
        })
    }catch(e){
        return NextResponse.json(e);

    }



}

// {
//     "Name": "saif",
//     "Email": "saif@example.com",
//     "Address": "CPO 1/16 MR III NRC E-8 ISLAMABAD",
//     "Mobile": "03102527460",
//     "Cradname": "Muhammad Saad",
//     "Cnic": "1234567891011",
//     "Brandname": "j.",
//     "Bank": "habib bank",
//     "BankAccountNumber": "1234567890",
//     "Password": "12345678",
//     "confirmPassword": "12345678"
// }