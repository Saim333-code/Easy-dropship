import ProductCard from "@/app/components/productCard"
import { app } from "@/app/_private/firebaseConfig"
import { getFirestore,getDoc,doc } from "firebase/firestore"
export default async function Product({params}) {
console.log(params.productid)
const db=getFirestore(app);
const docRef=doc(db,"products",`${params.productid}`)
let productData;
try {
    const doc=await getDoc(docRef);
    console.log(doc.data());
    productData=doc.data();
} catch (error) {
    console.log(error)
}
    return(

        <>
        {/* <div>{params.productid}</div> */}
        <ProductCard 
        id={params.productid}
        src1={productData.productsPageURL} 
        src2={productData.carousell} 
        src3={productData.carousell2}
        src4={productData.carousell3}
        name={productData.productname}
        description={productData.description}
        vendor={productData["vendor-name"]}
        price={productData.price}
        cutoffPrice={productData["cutoff-price"]}
         />
        </>
    )
}
// {
//     price: '1830',
//     productname: '|Shoes|Comfortable shoes | lethar shoes',
//     'vendor-name': 'eflare',
//     carousell: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/%7CShoes%7CComfortable%20shoes%20%7C%20lethar%20shoes-caroselimage1?alt=media&token=cff34a4a-6949-4b70-b982-f786940326b6',
//     carousell2: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/%7CShoes%7CComfortable%20shoes%20%7C%20lethar%20shoes-caroselimage2?alt=media&token=3424dec9-fd6f-45f7-b4e9-85c46b038f0a',
//     category: 'clothing',
//     'cutoff-price': '2000',
//     productsPageURL: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/%7CShoes%7CComfortable%20shoes%20%7C%20lethar%20shoes-productsPageimage?alt=media&token=38f8dded-a1d8-4e04-a8eb-39e5b59592b7',
//     description: 'Experience unparalleled comfort and timeless style with our Comfortable Leather Shoes. Crafted from premium leather, these shoes are designed for those who value both luxury and practicality. Whether you’re at the office, on a casual outing, or attending a special event, these shoes offer the perfect blend of elegance and ease.\n' +
//       '\n' +
//       'Key Features:\n' +
//       '\n' +
//       'Premium Leather Quality: Made from top-grade leather, these shoes offer a soft, supple feel while ensuring durability and long-lasting wear. The natural leather material also allows your feet to breathe, keeping them comfortable throughout the day.\n' +
//       'Ultimate Comfort: Designed with cushioned insoles and a supportive structure, these shoes provide all-day comfort, making them ideal for long hours of wear. The ergonomic design ensures a snug fit without compromising on style.\n' +
//       'Versatile Design: These leather shoes feature a classic design that pairs effortlessly with both formal and casual attire. Whether you’re dressing up for a meeting or going out for a relaxed evening, these shoes are the perfect choice.\n' +
//       'Durable and Long-Lasting: The high-quality construction and sturdy sole make these shoes a reliable option for everyday wear, ensuring they maintain their look and feel over time.\n' +
//       'Elegant Finish: The rich leather finish gives these shoes a sophisticated appearance that enhances any outfit, adding a touch of refinement to your wardrobe.'
//   }