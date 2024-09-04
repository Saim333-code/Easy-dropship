import Image from "next/image"
import Link from "next/link"
export default function OrdersCardAdmin(props){
    const {ID,customerName,customerEmail,time,postingPrice,product,shipperEmail}=props
    const date=time.toDate().toLocaleString()
    console.log(product)

    return(
        <>        
          
      <article className="relative max-w-3xl w-full rounded-xl bg-white p-6 ring ring-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
      <Link href={`/admin/pending-orders/${shipperEmail}/${ID}`}>
        {/* Decorative Element */}
        <div
          className="absolute top-0 left-0 hidden h-full w-1 bg-emerald-500 sm:block"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center gap-1 h-full">
            <span className="h-8 w-1 rounded-full bg-emerald-500"></span>
            <span className="h-6 w-1 rounded-full bg-emerald-500"></span>
            <span className="h-4 w-1 rounded-full bg-emerald-500"></span>
            <span className="h-6 w-1 rounded-full bg-emerald-500"></span>
            <span className="h-8 w-1 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        <div className="flex items-start sm:gap-8">
          <div className="flex-1">
            <strong
              className="inline-block rounded border border-emerald-500 bg-emerald-500 px-3 py-1.5 text-[10px] font-medium text-white"
            >
              {ID}
            </strong>

            <h3 className="mt-4 text-lg font-semibold text-gray-800 sm:text-xl">
              <span className="hover:underline">{customerName}</span>
            </h3>

            <p className="mt-1 text-sm text-gray-600">{customerEmail}</p>

            <div className="mt-4 flex items-center gap-2 text-gray-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>

              <p className="text-xs font-medium">{date}</p>

              <span className="hidden sm:block" aria-hidden="true">&middot;</span>

              <p className="text-xs font-medium text-gray-500">
                RS <span className="font-semibold text-emerald-600 hover:text-emerald-700">{postingPrice}</span>
              </p>
            </div>
          </div>
        </div>
        </Link>
      </article>
    
        </>
    )
}