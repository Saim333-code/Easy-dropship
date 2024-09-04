
//   /*
//     {
//     id: 'ZlsZyGDVVZXJhratnpwa',
//     carousell: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/water%20bottle%7C%20express%20water%20bottle%7Cnothing%20is%20finished-caroselimage1?alt=media&token=8a357daa-7e1b-4c66-b257-89eda40d69e3',
//     productsPageURL: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/water%20bottle%7C%20express%20water%20bottle%7Cnothing%20is%20finished-productsPageimage?alt=media&token=8f7d108b-c20d-498a-9de4-131eddea7443',
//     carousell2: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/water%20bottle%7C%20express%20water%20bottle%7Cnothing%20is%20finished-caroselimage2?alt=media&token=174b0535-5e53-4132-99ff-beb106bc1fe8',
//     category: 'Food',
//     productname: 'water bottle| express water bottle|nothing is finished',
//     price: '1230',
//     'cutoff-price': '1400',
//     'vendor-name': 'Eflare',
//     description: `Introducing the Express Water Bottle, where the phrase "Nothing is Finished" embodies the spirit of continuous refreshment and limitless possibilities. This water bottle is designed for those who are always on the go, seeking to stay hydrated while embracing every adventure with a mindset that there's always more to achieve.\n` +
//       '\n' +
//       'Key Features:\n' +
//       '\n' +
//       'Sleek and Stylish Design: The Express Water Bottle boasts a modern and sleek design that looks great in any setting, from the gym to the office. Its minimalist aesthetic makes it a versatile accessory for every occasion.\n' +
//       "Durable Construction: Made from high-quality, BPA-free materials, this water bottle is built to last. It's tough enough to withstand your busiest days, ensuring that your hydration needs are always met.\n" +
//       'Leak-Proof Seal: Never worry about spills with the Express Water Bottle’s leak-proof cap, designed to keep your bag and belongings safe from unwanted leaks and drips.\n' +
//       'Easy to Carry: Lightweight and ergonomically designed, this water bottle fits comfortably in your hand or bag, making it the perfect companion for any activity.'
//   }
//   */

// "use client";
// import Gallery from "../components/productsGallery";
// import { app } from "../_private/firebaseConfig";
// import { getFirestore, getDocs, collection, query, orderBy, startAfter, limit } from "firebase/firestore";
// import Link from "next/link";
// import { useEffect, useState, useCallback } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import BasicLoader from "../components/basicLoader";

// export default function Productpage() {
//   const [data, setData] = useState([]);
//   const [lastVisible, setLastVisible] = useState(null);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const fetchData = useCallback(async () => {
//     if (loading || !hasMore) return; // Prevent multiple simultaneous calls or unnecessary fetches
//     setLoading(true);

//     try {
//       const db = getFirestore(app);
//       const collectionRef = collection(db, "products");
//       let q;

//       if (lastVisible) {
//         q = query(collectionRef, orderBy("uploadedAt", "desc"), startAfter(lastVisible), limit(10));
//       } else {
//         q = query(collectionRef, orderBy("uploadedAt", "desc"), limit(10));
//       }

//       const dataSnapshot = await getDocs(q);
//       const newProducts = dataSnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       if (newProducts.length > 0) {
//         setData((prevData) => {
//           const newData = newProducts.filter((product) => !prevData.some((item) => item.id === product.id));
//           return [...prevData, ...newData];
//         });
//         setLastVisible(dataSnapshot.docs[dataSnapshot.docs.length - 1]);
//       } else {
//         setHasMore(false); 
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false); 
//     }
//   }, [lastVisible, loading, hasMore]);

//   useEffect(() => {
//     fetchData(); 
//   }, [fetchData]);

//   return (
//     <section className="container mx-auto p-10 md:py-12 px-0 md:p-8 md:px-0">
//       <InfiniteScroll
//         dataLength={data.length}
//         next={fetchData}
//         hasMore={hasMore}
//         loader={<BasicLoader/>}
//         endMessage={<p className="text-center text-xl font-semibold mt-6 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
//           No more products to show
//         </p>
        
//         }
//       >
//         <section className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start">
//           {data.map((e) => (
//             <Link href={`/products/${e.id}`} key={e.id}>
//               <Gallery
//                 name={e.productname}
//                 src={e.productsPageURL}
//                 cutoutprice={e["cutoff-price"]}
//                 orignalprice={e.price}
//                 dropshipper={e["vendor-name"]}
//                 id={e.id}
//               />
//             </Link>
//           ))}
//         </section>
//       </InfiniteScroll>
//     </section>
//   );
// }
"use client";
import Gallery from "../components/productsGallery";
import { app } from "../_private/firebaseConfig";
import { getFirestore, getDocs, collection, query, orderBy, startAfter, limit, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BasicLoader from "../components/basicLoader";

export default function Productpage() {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const db = getFirestore(app);
      const collectionRef = collection(db, "products");
      let q;

      if (isSearching) {
        q = query(
          collectionRef,
          where("productname", ">=", searchQuery),
          where("productname", "<=", searchQuery + "\uf8ff"),
          orderBy("productname"),
          limit(10)
        );
      } else if (lastVisible) {
        q = query(
          collectionRef,
          orderBy("uploadedAt", "desc"),
          startAfter(lastVisible),
          limit(10)
        );
      } else {
        q = query(collectionRef, orderBy("uploadedAt", "desc"), limit(10));
      }

      const dataSnapshot = await getDocs(q);
      const newProducts = dataSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (newProducts.length > 0) {
        setData((prevData) => {
          const newData = newProducts.filter(
            (product) => !prevData.some((item) => item.id === product.id)
          );
          return [...prevData, ...newData];
        });
        setLastVisible(dataSnapshot.docs[dataSnapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }

      if (isSearching) {
        setHasMore(false);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [lastVisible, loading, hasMore, searchQuery, isSearching]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchQuery === "") {
      return;
    }
    setData([]);
    setLastVisible(null);
    setHasMore(true);
    setIsSearching(true);
    fetchData();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setData([]);
    setLastVisible(null);
    setHasMore(true);
    setIsSearching(false);
    fetchData();
  };

  return (
    <section className="container mx-auto p-10 md:py-12 px-0 md:p-8 md:px-0">
      <div className="mb-8 flex items-center mx-3">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={handleSearchClick}
          className="ml-2 p-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none"
        >
          Search
        </button>
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="ml-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        )}
      </div>
      <InfiniteScroll
        dataLength={data.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<BasicLoader />}
        endMessage={
          <p className="text-center text-xl font-semibold mt-6 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
            No more products to show
          </p>
        }
      >
        <section className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start">
          {data.map((e) => (
            <Link href={`/products/${e.id}`} key={e.id}>
              <Gallery
                name={e.productname}
                src={e.productsPageURL}
                cutoutprice={e["cutoff-price"]}
                orignalprice={e.price}
                dropshipper={e["vendor-name"]}
                id={e.id}
              />
            </Link>
          ))}
        </section>
      </InfiniteScroll>
    </section>
  );
}
