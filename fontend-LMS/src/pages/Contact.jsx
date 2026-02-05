import React, { useState } from "react";
import HomeLayout from "./../layout/HomeLayout";
import toast from "react-hot-toast";
import { isEmail } from "../Helper/regexMatcher";
import axiosInstance from "../Helper/axiosInstance";

const Contact = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("All fields are mandatory");
      return;
    }
    if (!isEmail(userInput.email)) {
      toast.error("please enter valid email");
      return;
    }

    try {
      const response = await axiosInstance.post("/contact", userInput);
      toast.promise(response, {
        loading: "Submitting your message...",
        success: "Submited your message",
        error: "Failed to submit the form",
      });

      const contactResponse = await response;
      if (contactResponse?.data?.success) {
        setUserInput({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error("operation failed...");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh] px-4">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col items-center gap-5 rounded-xl text-white shadow-[0_0_20px_rgba(0,0,0,0.6)] w-[24rem] p-6 backdrop-blur-md bg-white/10 border border-white/20"
        >
          <h1 className="text-3xl font-bold tracking-wide mb-2">
            Contact Form
          </h1>

          {/* NAME */}
          <div className="flex flex-col w-full font-semibold">
            <label htmlFor="name" className="text-xl">
              Name
            </label>
            <input
              className="bg-transparent border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleInputChange}
              value={userInput.name}
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col w-full font-semibold">
            <label htmlFor="email" className="text-xl">
              Email
            </label>
            <input
              className="bg-transparent border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={userInput.email}
              onChange={handleInputChange}
            />
          </div>

          {/* MESSAGE */}
          <div className="flex flex-col w-full font-semibold">
            <label htmlFor="message" className="text-xl">
              Message
            </label>
            <textarea
              className="bg-transparent border px-3 py-2 rounded-md resize-none h-28 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              id="message"
              name="message"
              placeholder="Write message"
              value={userInput.message}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full text-lg bg-yellow-600 hover:bg-yellow-500 transition-all rounded-md font-semibold cursor-pointer py-2 shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Contact;
