import HomeLayout from "../layout/HomeLayout";
import Main from '../assets/home1.png'

import { Link } from 'react-router-dom';
function HomePage() {
  return (
    <HomeLayout>
      <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[100vh]">
        <div className="w-1/2 space-y-6">
          <h1 className="text-5xl font-semibold">
            Find out Best
            <span className="text-yellow-500 font-bold"> Online courses</span>
          </h1>

          <p className="text-xl text-gray-200 ">
            we have a large library of courses taught by highly skilled and
            qualified faculties
          </p>
          <div className="space-x-6 ">
            <Link to="/courses">
              <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                Explore course
              </button>
            </Link>
            <Link to="/contact">
              <button className=" border border-yellow-400 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                Contact 
              </button>
            </Link>
          </div>
        </div>
        <div className=" w-1/2 flex items-center justify-center">
            <img src={Main} alt="" />
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
