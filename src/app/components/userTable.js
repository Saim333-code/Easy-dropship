"use client"
import Link from "next/link";
import { getFirestore,collection,getDocs} from "firebase/firestore";
import { app } from "../_private/firebaseConfig";
import { useEffect, useState } from "react";
// async function getData() {
//   // let userData = await fetch('http://localhost:80/apis/getUsersData');
//   // let userData = await fetch('http://127.0.0.1:3000/apis/getUsersData');

//   // let res=await userData.json();

  
//   // return res.Data;

//   let data=[
//     {id:1,
//       Name:"saif",
//       Email:"Saif@mail.com",
//     },
//     {id:2,
//       Name:"saif",
//       Email:"Saif@mail.com",
//     },
//     {id:"QBBhRScrPt4qGlsjESGT",
//       Name:"saif",
//       Email:"Saif@mail.com",
//     }
//   ]
//   return data;
// }



export default  function UserTable() {

const [usersData,setusersData]=useState([]);


useEffect(()=>{
async function getData() {
  const db=getFirestore(app);
  const userCollection = collection(db, 'users');
  const snapshot = await getDocs(userCollection);
  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
}));

let userData=users.map(user=>({
    id:user.id,
    Name:user.Name,
    Email:user.Email
}))
setusersData(userData)
}
getData();
},[])
// console.log(usersData)
  return (
    <>
    <div className="p-4 sm:ml-64">
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">ID</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Email</th>
                  {/* <th scope="col" className="px-6 py-4">Handle</th> */}
                </tr>
              </thead>
              <tbody>
               {
                usersData.map((e)=>{
                  return (
                  
                  <tr className="border-b dark:border-neutral-500 cursor-pointer" key={e.id}>
                    
                  <td className="whitespace-nowrap px-6 py-4 font-medium hover:underline"><Link href={`/admin/${e.id}`} >{e.id}</Link></td>
                  <td className="whitespace-nowrap px-6 py-4 hover:underline"><Link href={`/admin/${e.id}`} >{e.Name}</Link></td>
                  <td className="whitespace-nowrap px-6 py-4 hover:underline"><Link href={`/admin/${e.id}`} >{e.Email}</Link></td>
                  
                </tr>
                  )
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}