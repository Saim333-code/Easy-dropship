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
   <div className="p-4 sm:ml-64 flex justify-center">
  <div className="flex flex-col w-full max-w-4xl border border-gray-300 shadow-lg rounded-lg">
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full py-2">
        <div className="overflow-hidden">
          <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr>
              <th scope="col" className="px-6 py-4">sr no.</th>
                <th scope="col" className="px-6 py-4">ID</th>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((e,index) => {
                return (
                  <tr
                    className="border-b dark:border-neutral-500 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                    key={e.id}
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium hover:underline">
                      {index+1}.
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium hover:underline">
                      <Link href={`/admin/${e.id}`}>{e.id}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 hover:underline">
                      <Link href={`/admin/${e.id}`}>{e.Name}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 hover:underline">
                      <Link href={`/admin/${e.id}`}>{e.Email}</Link>
                    </td>
                  </tr>
                );
              })}
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