import Image from 'next/image';

const Info = () => {
  return (
    <div className="w-full flex flex-col md:flex-row bg-gray-50 py-12">
    {/* Image Section */}
    <div className="flex-1 relative h-64 md:h-auto">
      <Image
        src="/dropinfo.jpg" // Replace with your image path
        alt="Dropshipping"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0"
      />
    </div>

    {/* Text Section */}
    <div className="flex-1 p-6 md:p-12 flex flex-col justify-center">
      <p className="text-lg mb-4">
        What is <span className="text-xl font-bold">Dropshipping?</span>
      </p>
      <p className="text-base mb-4">
        Dropshipping is a streamlined retail model where you, the seller, don&#39;t need to hold any inventory. Instead, when a customer places an order through your online store, the product is directly shipped from a supplier to the customer. This eliminates the need for you to manage stock, warehouses, or shipping logistics. It&#39;s an efficient, cost-effective way to run an eCommerce business with minimal overhead.
      </p>
      <p className="text-lg font-semibold mb-4">
        How Can You Use Our Dropshipping Services?
      </p>
      <p className="text-base mb-4">
        At <span className="text-emerald-600 font-semibold">EasyDropship</span>, we make dropshipping hassle-free for you. Here&#39;s how you can get started:
      </p>
      <p className="  text-base mb-4">
        <span className="block text-2xl font-bold mb-1">Product Sourcing:</span> We connect you with a vast range of high-quality products from reliable suppliers across multiple niches. Choose the products that fit your store and target audience.
      </p>
      <p className=" text-base mb-4">
        <span className="block text-2xl font-bold  mb-1">Seamless Integration:</span> Our platform integrates easily with your online store, ensuring that orders placed by your customers are automatically forwarded to our system for processing.
      </p>
      <p className=" text-base mb-4">
        <span className="block text-2xl font-bold mb-1">Order Fulfillment:</span> Once we receive an order, our team takes care of the rest—packing, shipping, and delivering the product straight to your customer&#39;s doorstep, anywhere in Pakistan. You&#39;ll be updated every step of the way with real-time tracking.
      </p>
      <p className="  text-base mb-4">
        <span className="block text-2xl font-bold mb-1">No Inventory Risk:</span> Since you&#39;re not required to purchase stock upfront, there&#39;s no risk of unsold inventory. You only pay for what you sell, allowing you to scale your business with confidence.
      </p>
      <p className="  text-base mb-4">
        <span className="block text-2xl font-bold mb-1">Support and Guidance:</span> Whether you&#39;re new to dropshipping or looking to optimize your existing operations, our team is here to provide ongoing support and expert advice to ensure your business thrives.
      </p>
      <p className="text-base">
        With <span className="text-emerald-600 font-semibold">EasyDropship</span>&#39;s comprehensive dropshipping services, you can focus on marketing and growing your brand while we handle the logistics. Let us be your trusted partner in delivering a smooth, efficient, and profitable dropshipping experience!
      </p>
    </div>
  </div>
  );
};

export default Info;
