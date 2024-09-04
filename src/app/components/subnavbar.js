import Link from 'next/link';

const SubNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex space-x-4">
              <Link href="/orders" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                 Pending Orders
              </Link>
              <Link href="/orders/placed-orders" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Placed orders
              </Link>
              <Link href="/orders/fullfilled-orders" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                Fulfilled Orders
              </Link>
            </div>
          </div>
          
        </div>
      </div>

      
    </nav>
  );
}

export default SubNavbar;
