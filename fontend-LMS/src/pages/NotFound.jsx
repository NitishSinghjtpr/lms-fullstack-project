import React from 'react'
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate=useNavigate()
  return (
    <div className='bg-[#1A2238] h-screen w-full flex flex-col items-center justify-center'>
      <h1 className='text-9xl tracking-widest font-extrabold text-white'>
        404
      </h1>
      <div className=' bg-black text-white px-2 text-sm rounded rotate-12 absolute'>
        Page Not Found 
      </div>
      <button className=' mt-5'>
        <a className=' relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-yellow-500 focus:outline-none focus:fing'>
          <span onClick={()=>navigate(-1)} className=' relative block px-3 pt-auto bg-[#1A2238] border border-current'>
                  Go Back
          </span>
        </a>
        
      </button>
    </div>
  )
}

export default NotFound;
