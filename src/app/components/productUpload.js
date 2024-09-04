"use client"

import { useState,useEffect } from "react";
import { app } from "../_private/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from "react-toastify";
import { getFirestore,collection,addDoc, Timestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./bottomLoader";
export default function ImageUploadForm() {

const [image1,setImage1]=useState();
const [image2,setImage2]=useState();
const [image3,setImage3]=useState();
const [image4,setImage4]=useState();
const [data,setData]=useState({})
const storage=getStorage(app);
const  store=getFirestore(app);
const router=useRouter();
const [overlayLoading,setOverlayloading]=useState(false)
const state=useSelector(data=>data.userData)
if(state.isAdmin===false){
  router.replace("/")
}

const changeImage1=(e)=>{
   
    let files=e.target.files;
    setImage1(files[0])
  
}

const changeImage2=(e)=>{
    let files=e.target.files;
    setImage2(files[0])
  
}

const changeImage3=(e)=>{ 
    let files=e.target.files; 
    setImage3(files[0])
}
const changeImage4=(e)=>{ 
  let files=e.target.files; 
  setImage4(files[0])
}
const handleChange=(e)=>{
    const {name , value} = e.target;
setData((prev)=>({
    ...prev,
    [name]:value
})
)
}
const onSubmit=async (e)=>{
  setOverlayloading(true)
   
    e.preventDefault()
    try{
    const storageRef1=ref(storage,`${data.productname}-productsPageimage`)
    const storageRef2=ref(storage,`${data.productname}-caroselimage1`)
    const storageRef3=ref(storage,`${data.productname}-caroselimage2`)
    const storageRef4=ref(storage,`${data.productname}-caroselimage3`)
    await uploadBytes(storageRef1, image1);
    await uploadBytes(storageRef2, image2);
    await uploadBytes(storageRef3, image3);
    await uploadBytes(storageRef4, image4);


    const url1 = await getDownloadURL(storageRef1);
    const url2 = await getDownloadURL(storageRef2);
    const url3 = await getDownloadURL(storageRef3);
    const url4 = await getDownloadURL(storageRef3);

    data["productsPageURL"]=url1
    data["carousell"]=url2
    data["carousell2"]=url3
    data["carousell3"]=url4
    data["uploadedAt"]=Timestamp.now();
        try{
          const usersCollectionRef = collection(store, "products");
          const docRef = await addDoc(usersCollectionRef, data);
          setOverlayloading(false)
          router.replace('/admin');
          toast.success(`product uploaded\nID: ${docRef.id}`);
          console.log(data)
          return
        }catch(error){
          toast.error("Error Uploading product")
          return
        }
    
    }
    catch(error){
        console.log(error)
    }
}

  return (
    <>
    {overlayLoading && <LoadingOverlay/>}
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Upload Product Images</h2>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Upload Image 1</label>
          <input
            type="file"
            id="image-upload"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"

            onChange={(e)=>changeImage1(e)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Upload Image 2</label>
          <input
            type="file"
            id="image-upload"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            
            onChange={(e)=>changeImage2(e)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Upload Image 3</label>
          <input
            type="file"
            id="image-upload"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        
            onChange={(e)=>changeImage3(e)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Upload Image 4</label>
          <input
            type="file"
            id="image-upload"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        
            onChange={(e)=>changeImage4(e)}
          />
        </div>
        {/* Product Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="product-name"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product name"
              required
              onChange={(e)=>{handleChange(e)}}
              name="productname"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Product Price</label>
            <input
              type="text"
              id="product-price"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product price"
              required
              onChange={(e)=>{handleChange(e)}}
              name="price"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="cutoff-price" className="block text-sm font-medium text-gray-700">Cutoff Price</label>
            <input
              type="text"
              id="cutoff-price"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter cutoff price"
              required
              onChange={(e)=>{handleChange(e)}}
              name="cutoff-price"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="vendor-name" className="block text-sm font-medium text-gray-700">Vendor Name</label>
            <input
              type="text"
              id="vendor-name"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter vendor name"
              required
              onChange={(e)=>{handleChange(e)}}
              name="vendor-name"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="vendor-name" className="block text-sm font-medium text-gray-700">category</label>
            <input
              type="text"
              id="category"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Category"
              required
              onChange={(e)=>{handleChange(e)}}
              name="category"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Product Description</label>
            <textarea
              id="product-description"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description"
              rows="4"
              required
              onChange={(e)=>{handleChange(e)}}
              name="description"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={(e)=>onSubmit(e)}>
            Submit
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

