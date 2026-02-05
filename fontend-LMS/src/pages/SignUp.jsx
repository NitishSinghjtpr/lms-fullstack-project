import React, { useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createAccount } from "../Redux/Slice/AuthSlice";
import { isEmail, isValidPassword } from "../Helper/regexMatcher";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });

  // handle input
  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  // selecting image
  function getImage(event) {
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });

      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setPreviewImage(this.result);
      });
    }
  }

  // submit form
  async function createNewAccount(event) {
    event.preventDefault();

    if (
      !signupData.email ||
      !signupData.password ||
      !signupData.name ||
      !signupData.avatar
    ) {
      toast.error("Please fill all the details");
      return;
    }

    if (signupData.name.length < 5) {
      toast.error("Name should be at least 5 characters");
      return;
    }

    if (!isEmail(signupData.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!isValidPassword(signupData.password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number & be 5+ chars",
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar);

    // dispatch action (TODO)
    // dispatch(registerUser(formData));

    const response = await dispatch(createAccount(formData));
    if (response?.payload?.success) {
      navigate("/");
    }

    setSignupData({
      name: "",
      email: "",
      password: "",
      avatar: "",
    });

    setPreviewImage("");
  }

  return (
    <HomeLayout>
      <div className="flex overflow-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>

          {/* IMAGE UPLOAD */}
          <label htmlFor="image_upload" className="cursor-pointer">
            {previewImage ? (
              <img
                src={previewImage}
                alt=""
                className="w-24 h-24 rounded-full m-auto"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>

          <input
            onChange={getImage}
            className="hidden"
            name="image_upload"
            type="file"
            id="image_upload"
            accept=".jpg,.jpeg,.png,.svg"
          />

          {/* FULL NAME */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-semibold">
              Full Name
            </label>
            <input
              type="text"
              required
              name="name"
              id="name"
              placeholder="Enter your full name..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.name}
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>

          {/* BUTTON */}
          <button
            className="bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer"
            type="submit"
          >
            Create Account
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="link hover:text-blue-600 text-blue-300 cursor-pointer"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};

export default SignUp;
