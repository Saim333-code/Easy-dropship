import Link from "next/link";

export default function Successpopover(props){
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
    <h3 className="text-lg font-semibold text-green-600">Success</h3>
    <p className="text-gray-700">
      Your order is placed! You can continue shopping.
    </p>
    <div className="flex justify-end">
        <Link href={"/products"}>
      <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
        <Link href={"/products"}> Shop More </Link>
      </button>
      </Link>
    </div>
  </div>
</div>

    )
}