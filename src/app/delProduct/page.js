"use client"
import { app } from "../_private/firebaseConfig"
import { getFirestore,collection,getDocs} from "firebase/firestore";
import Deletecard from "../components/delproductcard"
import NOdatacard from "../components/noDatacard";
import { useEffect, useState } from "react";

export default  function DeleteProduct(){
    const [products,setProducts]=useState([])
    // console.log(products)
    
    useEffect(()=>{
        async function getData() {
            const db=getFirestore(app);
            const userCollection = collection(db, 'products');
            const snapshot = await getDocs(userCollection);
            const product = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(product)
            }
            getData()
    })
    return (
        <>
        {
            products.length !== 0 ?
            <section className="container mx-auto p-10 md:py-12 px-0 md:p-8 md:px-0">
    <section
        className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start ">

        {
        products.map((e)=>{
            return(
        <Deletecard 
        key={e.id}
        name={e.productname}
        orignalprice={e.price}
        src={e.productsPageURL}
        description={e.description}
        id={e.id}
        />
    )
    })
    }
        </section>
        </section>
            :
            <NOdatacard text={"NO products uploaded"}/>

            
           
}
        </>
    )
}

// import { app } from "../_private/firebaseConfig"
// import { getFirestore,collection,getDocs} from "firebase/firestore";
// import Deletecard from "../components/delproductcard"
// import NOdatacard from "../components/noDatacard";





// export default async function DeleteProduct(){
//     const db=getFirestore(app);
//     const userCollection = collection(db, 'products');
//     const snapshot = await getDocs(userCollection);
//     const products = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }));

//     console.log(products)
//     return (
//         <>
//         {
//             products.length !== 0 ?
//             <section className="container mx-auto p-10 md:py-12 px-0 md:p-8 md:px-0">
//     <section
//         className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start ">

//         {
//         products.map((e)=>{
//             /*
//              {
//     id: 'zvtYiOhGYTavJTMGsrlZ',
//     productsPageURL: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/nothing2-productsPageimage?alt=media&token=0e84043d-797b-4454-8346-7eac86aa74b5',
//     carousell: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/nothing2-caroselimage1?alt=media&token=179495fe-bfe7-4714-9cbb-5ef62a46ae0b',
//     description: 'fdhfjdflkfDFHCBVNCAV',
//     carousell2: 'https://firebasestorage.googleapis.com/v0/b/eflare-34fdf.appspot.com/o/nothing2-caroselimage2?alt=media&token=5a1c4856-5713-4641-ac64-f0bb08492926',
//     category: 'IT & Programming',
//     price: '123',
//     'vendor-name': 'eflare',
//     productname: 'nothing2',
//     'cutoff-price': '123'
//   }
//              */
//             return(
//         <Deletecard 
//         key={e.id}
//         name={e.productname}
//         orignalprice={e.price}
//         src={e.productsPageURL}
//         description={e.description}
//         id={e.id}
//         />
//     )
//     })
//     }
//         </section>
//         </section>
//             :
//             <NOdatacard text={"NO products uploaded"}/>

            
           
// }
//         </>
//     )
// }
// "use client"