"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import NOdatacard from './noDatacard';

export default function UserTable(props) {
  const Orders=props.users
  const router=useRouter();
    console.log("userTbale : 5");
    console.log(Orders)
    const clickHandle=(id)=>{
        router.push(`/admin/pending-orders/${id}`)
        return
    }
    return (
        <div className="container mx-auto py-2">
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 text-center">Email</th>
                        <th className="py-2 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    Orders.length > 0 ?  Orders.map((user, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-2 px-4 text-center">{user.id}</td> {/* Aligns with Email header */}
                            <td className="py-2 px-4 text-center">
                                <div className="flex justify-center items-center">
                                    <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                    onClick={(e)=>clickHandle(user.id)}
                                    >
                                        Preview
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                    :
                    <NOdatacard text="No pending orders"/>
                
                }
                </tbody>
            </table>
        </div>
    </div>
    
    
    );
}
