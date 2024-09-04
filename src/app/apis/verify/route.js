import { app } from "@/app/_private/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore,doc,deleteDoc,setDoc,collection } from "firebase/firestore";
import axios from "axios";
// import {getDatabase} from "firebase/database"
// import { set,ref } from "firebase/database";
import { NextResponse } from "next/server";

async function SendEmail(userEmail,password,Name) 
{ 
    try{
    const EmailRoute=process.env.EMAIL_ROUTE;
    let request=await axios.post(EmailRoute,{
        EmailAddress:userEmail,
        Text:"Your account has been verified",
        Subject:"Account verification",
        Html:`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Congratulations!</title>
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
            </style>
        </head>
        <body>
            <div class="container">
                <h1 style="color: green">Congratulations!</h1>
                <p>Dear ${Name},</p>
                <p>Congratulations on successfully verifying your account with EASYDROP SHIP!</p>
                <p>Here are your account details:</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>Please keep your password secure and do not share it with anyone.</p>
                <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                <p>Best regards,<br>EASY DROPSHIP</p>
                <div class="footer">
                    <p>&copy; 2024 EASY DROPSHIP. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
`,
        ReturnResponse:"Your account has been verified"
       }, {
        headers: {
          'Content-Type': 'application/json'  
        }
      })   
      console.log(request.data) 
return request.data.message}
catch(error){
    console.log(error)
    return "Unable to send email"

}
}
export async function POST(req) {
   const initials=await req.json();
    
    const Auth=getAuth(app);
    const db=getFirestore(app);
    const {method} = initials;
    
    if(method ==="verify"){
        const {Email,Password,id,Name} =initials;
        const docRef=doc(db,"users",id)
    try {
        const userCredential = await createUserWithEmailAndPassword(Auth, Email, Password);
        // Registered user information
        const user = userCredential.user;
        console.log('User created:', user);
        try{
        await deleteDoc(docRef)
       // Reference to the user document inside the verifiedUsers collection
    const userDocRef = doc(db, "verifiedUsers", `${user.email}`);

    // Reference to the userInfo subcollection inside the user's document
    // const userInfoSubCollectionRef = collection(userDocRef, "userInfo");

    // // Reference to the document inside the userInfo subcollection
    // const userInfoDocRef = doc(userInfoSubCollectionRef, "userInfoDoc"); 
        // let dataTostore=JSON.parse(JSON.stringify(initials));
        await setDoc(userDocRef, initials);
        await SendEmail(Email,Password,Name)
        return NextResponse.json({
                    User:user,
                    Result:"Success"
                },{
                    status:201
                });
    //    let mailResponse=await SendEmail(Email,Password,Name)
    //    if(mailResponse === "Your account has been verified"){
        // return NextResponse.json({
    //         User:user,
    //         Result:"Success"
    //     },{
    //         status:201
    //     });
    //    }else{
    //     return NextResponse.json({
    //         User:user,
    //         Result:"Success! But unable to send Email"
    //     },{
    //         status:201
    //     });
    //    }
      
        
    }catch(err){
        return NextResponse.json({
            User:err.message,
            Result:"Failure"
        },{
            status:201
        })
    }
      } catch (error) {
        console.error('Error creating user:', error.message);
        return NextResponse.json({
            User:error.message,
            Result:"Failure"
        },{
            status:201
        })
      }
    }
    if(method === "Delete"){
        const {id} =initials;
        const docRef=doc(db,"users",id)
        try{
            await deleteDoc(docRef)
            return NextResponse.json({
                // User:user,
                Result:"Deleted User"
            },{
                status:201
            });
        }catch(err){
            return NextResponse.json({
                User:err.message,
                Result:"Fail to delete"
            },{
                status:201
            })
    }
}
}