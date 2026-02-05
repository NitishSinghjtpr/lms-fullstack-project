import { AiFillCheckCircle } from "react-icons/ai";
import HomeLayout from "../../layout/HomeLayout";
import { Link } from 'react-router-dom';
import { ImCross } from "react-icons/im";

 function CheckoutFailure(){
 return(
    <HomeLayout>
        <div className=" min-h-[90vh] flex items-center justify-center text-white">
            <div className=" w-80 h-[26rem] flex flex-col justify-center text-center shadow-[0_0_10px_black] rounded-lg relative ">
                    <h1 className=" bg-red-500 top-0 absolute w-full py-4 text-2xl font-bold text-center rounded-tl-lg">
                        Payment Failed
                    </h1>
                    <div className=" px-4 flex flex-col items-center justify-center space-y-2">
                            <div className=" text-center space-y-2">
                                <h2 className=" text-lg font-semibold">Oops! your payment failed</h2>
                                <p className=" text-left">Please try again.</p>
                            </div>
                            <ImCross className=" text-red-500 text-5xl"/>
                    </div>

                    <Link to="/checkout" className=" bg-red-500 hover:bg-red-600 transition-all absolute ease-in-out duration-300 bottom-0 w-full rounded-bl-lg py-2 text-xl font-bold">
                    <button>Try again.</button></Link>
            </div>
        </div>
    </HomeLayout>
 )

 }

 
 export default CheckoutFailure;