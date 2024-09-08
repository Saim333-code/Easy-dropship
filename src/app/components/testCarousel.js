"use client"
import React, { useContext } from "react";
import { TECarousel, TECarouselItem } from "tw-elements-react";
import Image from "next/image";
export default function CarouselDarkVariant() {
  return (
    <>
      <TECarousel
        showControls
        showIndicators
        crossfade
        ride={false}
        
        prevBtnIcon={
          <>
            <span className="inline-block text-black h-8 w-8 [&>svg]:h-8">
                    <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
            fill="none" 
          />
      </svg>

            </span>
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Previous
            </span>
          </>
        }
        nextBtnIcon={
          <>
            <span className="inline-block text-black h-8 w-8 [&>svg]:h-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Next
            </span>
          </>
        }
        theme={{
          indicator:
            "mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-white bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
        }}
         className="h-5/6" >
        <div className="relative w-full md:h-[29.75rem] overflow-hidden after:clear-both after:block after:content-['']">
          <TECarouselItem
            itemID={1}
            className="relative float-left -mr-[100%] hidden w-full !transform-none transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
          >
            <Image
              src="/car2.jpg"
              className="block w-full"
              alt="..."
              height={3456}
              width={6144}
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-x-[15%] bottom-5 md:bottom-[34.5rem] font-serif py-5 text-center text-white font-extrabold md:block md:text-3xl">
              <h5 className="text-xl tracking-widest font-thin">Welcome to Easy Dropship</h5>
              <p className="tracking-widest font-serif font-medium">
              Simplify Your Ecommerce Journey.
              </p>
            </div>
          </TECarouselItem>
          <TECarouselItem
            itemID={2}
            className="relative float-left -mr-[100%] hidden w-full !transform-none opacity-0 transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
          >
             <div class="hidden md:block relative w-full h-[500px] overflow-hidden">
                        <Image
                            src="/car3.jpg"
                            className="absolute -bottom-[12.25rem] left-0 w-full h-auto object-fill"
                            alt="..."
                            height={3795}
                            width={5684}
                        />
                        </div>

            <Image
              src="/car3.jpg"
              className="block w-full md:hidden"
              alt="..."
              height={3795}
              width={5684}
             
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-x-[15%] bottom-5  md:text-3xl  md:bottom-[14.25rem] text-white py-5 text-center font-serif font-extrabold  md:block">
              {/* <h5 className="text-xl">EASYDROP SHIP</h5> */}
              <p className="tracking-widest font-serif font-medium">
              Only Solution To Every Ecommerce Problem
              </p>
            </div>
          </TECarouselItem>
          <TECarouselItem
            itemID={3}
            className="relative float-left -mr-[100%] hidden w-full !transform-none opacity-0 transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
          >
            <Image
              src="/car6.jpg"
              className="block w-full"
              alt="..."
              height={3360}
              width={5040}
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-x-[15%] bottom-5 md:bottom-[45.5rem]   py-5 text-center text-white font-serif font-extrabold md:block md:text-3xl">
              <h5 className="text-xl font-serif tracking-widest font-medium">Triple H:</h5>
              <p className="tracking-widest font-serif font-medium">
             Hum Hazir Hain.
              </p>
            </div>
          </TECarouselItem>
        </div>
      </TECarousel>
    </>
  );
}