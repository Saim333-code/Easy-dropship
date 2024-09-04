import { NextResponse } from "next/server";
import nodemailer from "nodemailer"
export async function POST(req) {
try{
const {EmailAddress,Text,Subject,Html,ReturnResponse}=await req.json()
const transporter=nodemailer.createTransport({
     host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // Use true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
})
    const mailOptions = {
    from: '"EASY DROPSHIP" <Easydropship@example.com>',
    to: EmailAddress,
    subject: Subject,
    text: Text,
    html: Html,
  };
 await transporter.sendMail(mailOptions);
 return NextResponse.json({
         message: `${ReturnResponse}`},{
        status:201
     } );
}catch(error){
    console.log("SMTP SERVER ERROR")
    console.log(error)
   return NextResponse.json({
        message: 'Error in sending mail'},{
        status:201
        } );
}
}