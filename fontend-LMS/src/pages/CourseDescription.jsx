import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import HomeLayout from "../layout/HomeLayout";
import { useSelector } from "react-redux";

function CourseDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { role, data } = useSelector((state) => state.auth);

  useEffect(() => {}, []);

  return (
    <HomeLayout>
      <div className=" min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-white">
        <div className=" grid grid-cols-2 gap-10 py-10 relative">
          <div className=" space-y-5">
            <img
              className=" w-full h-64" // ✔ FIXED: end-full → w-full
              src={state?.thumbnail?.secure_url}
              alt="thumbnail"
            />

            <div className=" space-y-4">
              <div className=" flex items-center justify-between text-xl">
                <p className=" font-semibold">
                  <span className=" text-yellow-500 font-bold">
                    Total lecture:{" "}
                  </span>
                  {state?.numberOfLactures}
                </p>
                <br />

                <p className=" font-semibold">
                  <span className=" text-yellow-500 font-bold">Category: </span>
                  {state?.category}
                </p>

                <p className=" font-semibold">
                  <span className=" text-yellow-500 font-bold">
                    Indtructor:{" "}
                  </span>
                  {state?.createdBy}
                </p>
              </div>

              {role === "admin" ||
              data?.subscription?.status?.toLowerCase() === "active" ? (
                <button onClick={() => navigate("/course/displaylectures",{state:{...state}})}  className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all duration-300">
                  Watch lecture
                </button>
              ) : (
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-yellow-600 text-xl rounded-md font-bold px-5 py-3 w-full hover:bg-yellow-500 transition-all duration-300"
                >
                  Subscribe
                </button>
              )}
            </div>
          </div>

          <div className=" space-y-2 text-xl">
            <h1 className=" text-3xl font-bold text-yellow-500 mb-5 text-center">
              {state?.title}
            </h1>
            <p className=" text-yellow-500">Course description</p>
            <p>{state?.description}</p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CourseDescription;
