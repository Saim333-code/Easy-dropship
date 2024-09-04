"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
const AdminDashboard = ({ placedOrdersTotal, fulfilledOrdersTotal,TotalDeliveryCharges,totalProfitEarned,checkOutsTotal}) => {
    //grab total price and shipper price from fulfilled orders and then subtract it from total checkouts
    console.log(checkOutsTotal)
    let totalPendingPayments=((fulfilledOrdersTotal-checkOutsTotal)-TotalDeliveryCharges)-totalProfitEarned;
    console.log(totalPendingPayments)
    

  const router=useRouter();
  return (
    <div className="relative bg-gray-50 py-16 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Admin Dashboard
          </h2>
          <p className="mt-4 text-lg text-gray-600 sm:mt-6">
            Overview of your order and payment statistics
          </p>
        </div>
      </div>

      <div className="mt-12 pb-6">
  <div className="relative">
    <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="flex flex-col border-b border-gray-200 p-6 text-center sm:border-0 sm:border-r">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Total of Placed Orders
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
              Rs {placedOrdersTotal > 0 ? placedOrdersTotal : 0 }/-
            </dd>
            <button
              className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-600 transition duration-300"
              onClick={() => {
                router.push("/admin/placed-orders");
              }}
            >
              Show Details
            </button>
          </div>
          <div className="flex flex-col border-t border-b border-gray-200 p-6 text-center sm:border-0 sm:border-l sm:border-r">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Total of Fulfilled Orders with Delivery
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
              Rs {fulfilledOrdersTotal}/-
            </dd>
            <button
              className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-600 transition duration-300"
              onClick={() => {
                router.push("/admin/fulfilled-orders");
              }}
            >
              View Details
            </button>
          </div>
          <div className="flex flex-col border-t border-gray-200 p-6 text-center sm:border-0 sm:border-l">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Pending Payments
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
              Rs {totalPendingPayments > 0 ? totalPendingPayments : 0}/-
            </dd>
            
          </div>
          {/* New row with two equal-width blocks */}
          <div className="flex flex-col border-t border-gray-200 p-6 text-center sm:col-span-1 sm:border-r">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
              Total profit Earned
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
            Rs {totalProfitEarned}/-
            </dd>
          </div>
          <div className="flex flex-col border-t border-gray-200 p-6 text-center sm:col-span-1">
            <dt className="order-2 mt-2 text-lg leading-6 font-semibold text-gray-500">
            Total Delivery Charges
            </dt>
            <dd className="order-1 text-4xl font-bold text-gray-700">
             Rs {TotalDeliveryCharges}/-
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</div>


      {/* Disclaimer Line */}
      <div className="w-full bg-emerald-500 py-3 text-center">
        <p className="text-white text-sm">
          Disclaimer: All information is subject to change.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
