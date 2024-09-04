"use client";
import React from "react";

const Slider = () => {
  return (
    <div className="relative w-full h-[80vh] mx-8 bg-slate-800 box-border">
      <input
        className="hidden peer/slider1 checkbox"
        type="radio"
        name="slider"
        id="slider1"
        defaultChecked
      />
      <input
        className="hidden peer/slider2 checkbox"
        type="radio"
        name="slider"
        id="slider2"
      />
      <input
        className="hidden peer/slider3 checkbox"
        type="radio"
        name="slider"
        id="slider3"
      />

      <div
        className="relative w-[300vw] h-[100%] flex transition-all duration-500 ease-in-out
        peer-checked/slider1:-left-0 
        peer-checked/slider2:-left-[100vw] 
        peer-checked/slider3:-left-[200vw]"
      >
        <div className="relative w-full h-full flex bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=600)' }}></div>
        <div className="relative w-full h-full flex bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=600)' }}></div>
        <div className="relative w-full h-full flex bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}></div>
      </div>

      <div
        className="absolute w-full flex justify-center gap-2 bottom-12 
        peer-[&_label:nth-of-type(1)]/slider1:peer-checked/slider1:opacity-100 
        peer-[&_label:nth-of-type(1)]/slider1:peer-checked/slider1:w-10 
        peer-[&_label:nth-of-type(2)]/slider2:peer-checked/slider2:opacity-100 
        peer-[&_label:nth-of-type(2)]/slider2:peer-checked/slider2:w-10 
        peer-[&_label:nth-of-type(3)]/slider3:peer-checked/slider3:opacity-100 
        peer-[&_label:nth-of-type(3)]/slider3:peer-checked/slider3:w-10"
      >
        <label
          className="block w-5 h-5 bg-white cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100"
          htmlFor="slider1"
        ></label>
        <label
          className="block w-5 h-5 bg-white cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100"
          htmlFor="slider2"
        ></label>
        <label
          className="block w-5 h-5 bg-white cursor-pointer opacity-50 z-10 transition-all duration-300 ease-in-out hover:scale-125 hover:opacity-100"
          htmlFor="slider3"
        ></label>
      </div>
    </div>
  );
};

export default Slider;
