"use client"
import Image from 'next/image';
const FulfilledOrders = (props) => {
const {
    ID,
    Items,
    postingPrice,
    postingAddress,
    customerName,
    customerMobile,
    customerEmail,
    status
    }=props.order


  const handleDelete = async () => {
  await props.delOrder(ID)
  };

  return (
    
        <>
          <div
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full relative"
          >
            <div className="absolute top-2 right-2">
              <button
                disabled={true}
                onClick={ handleDelete}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Delete order"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6v12" />
                  <path d="M12 6v12" />
                  <path d="M16 6v12" />
                  <path d="M6 6h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="relative flex space-x-2 overflow-hidden md:w-1/3 p-4">
                {Items.slice(0, 3).map((image, index) => (
                  <div key={index} className="relative w-1/3 h-32">
                    <Image
                      src={image.imageSrc}
                      alt={"/product.jpg"}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg border border-gray-200"
                    />
                  </div>
                ))}
                {Items.length > 3 && (
                  <div className="relative w-1/3 h-32 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg">
                    <span className="text-gray-600 text-lg font-bold">
                      +{Items.length - 3}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {customerName}
                  </h2>
                  <p className="text-gray-600">{postingAddress}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: {ID}</p>
                    <p className="text-sm text-gray-600">Status: {status}</p>
                    <p className="text-sm text-gray-600">Customer Mobile: {customerMobile}</p>
                    <p className="text-sm text-gray-600">Customer Email: {customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-emerald-700">
                      Rs {postingPrice}/-
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
      
  );
};

export default FulfilledOrders;
