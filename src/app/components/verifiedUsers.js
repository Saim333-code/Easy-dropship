"use client"
import React, { useEffect, useState } from 'react';
import { app } from '../_private/firebaseConfig';
import { getFirestore,getDocs,collection, getDoc,doc,updateDoc} from 'firebase/firestore';
import BasicLoader from './basicLoader';
import LoadingOverlay from './bottomLoader';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
// Main component with integrated table and popup
const UserTableWithPopup = (props) => {
    const db=getFirestore(app)
    const router=useRouter()

  const [users,setUsers]=useState([])
  const [selectedUser, setSelectedUser] = useState(null);
  const [securityFees, setSecurityFees] = useState(0);
  const [isLoading,setIsLoading]=useState(false)

  // Function to handle row click and open the popup
  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  // Function to handle submit of security fees
  const handleSubmit = async() => {
    if(isNaN(securityFees)){
        return
    }
    props.setOverLayloading(true)
    const docRef=doc(db,"verifiedUsers",`${selectedUser.Email}`)
    let choice=window.confirm(`Updating ${selectedUser.Email} security fee `)
    if(choice){
    await updateDoc(docRef,{
        Security:securityFees
    })
    let userData=await getDoc(docRef)
    if(userData.exists()){
        setSelectedUser(userData.data())
       await handlegetData()
     }else{
        setSelectedUser(null)
        await handlegetData()
     }
    props.setOverLayloading(false)
    router.refresh();
    toast.success("updated Security Fees")

}else{
    props.setOverLayloading(false)
}
  };
  const handlegetData=async()=>{
    setIsLoading(true)
    const docRef=collection(db,"verifiedUsers")
    let usersData=await getDocs(docRef)
    const userList=usersData.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
    //   console.log(userList)
      props.updateCount(userList.length)
      setUsers(userList)
      setIsLoading(false)
  }

  useEffect(()=>{
    handlegetData()
  },[])
  useEffect(()=>{
    handlegetData()
   
  },[props.updated])
  return (
    <>
    {
        isLoading ? <BasicLoader/> : 
    <div className="p-4">
      {/* Table for displaying user information */}
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-md relative">
        <thead className="bg-emerald-500 text-white sticky top-16">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sr.no</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">CNIC</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user,index) => (
            <tr
              key={user.id}
              onClick={() => handleRowClick(user)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}.</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.Name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.Cnic}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.Email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup for displaying detailed user information */}
      {selectedUser && (
        <>
        {
        props.overlayLoading ? <LoadingOverlay/>:
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-auto p-6 bg-white shadow-md rounded-md">
            {/* Close button (cross icon) */}
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-4 text-emerald-600">{selectedUser.Name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Cnic: </strong>{selectedUser.Cnic}</p>
              <p><strong>Email: </strong>{selectedUser.Email}</p>
              <p><strong>Mobile: </strong> {selectedUser.Mobile}</p>
              <p><strong>Security: </strong>Rs {selectedUser.Security}/-</p>
              <p><strong>Address:</strong> {selectedUser.Address}</p>
              <p><strong>Password: </strong> {selectedUser.Password}</p>
              <p><strong>Bank Name: </strong> {selectedUser.Bank}</p>
              <p><strong>Bank Account no: </strong> {selectedUser.BankAccountNumber}</p>
              <p><strong>Name on card:</strong>{selectedUser.Cardname}</p>
              <p><strong>Brand Name:</strong> {selectedUser.Brandname}</p>
            </div>

            <div className="mt-6 flex">
              <input
                type="number"
                placeholder={props.placeholder}
                className="p-2 w-full border rounded-md"
                onChange={(e) => {
                  if (e.target.value && e.target.value > 0) {
                    setSecurityFees(parseInt(e.target.value));
                  } else {
                    setSecurityFees(0);
                  }
                }}
              />
              <button
                onClick={handleSubmit}
                className="ml-2 p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        }
        </>
      )}
    </div>
    }
    </>
  );
};

export default UserTableWithPopup;
