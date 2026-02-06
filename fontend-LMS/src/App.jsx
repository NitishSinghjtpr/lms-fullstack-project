import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import CourseList from "./pages/coursePage/CourseList";
import Contact from "./pages/Contact";
import Denied from "./pages/Denied";
import CourseDescription from "./pages/CourseDescription";
import RequireAuth from "./components/Auth/RequireAuth";
import CreateCourse from "./pages/CreateCourse";
import Profile from "./pages/User/Profile";
import EditProfile from "./pages/User/EditProfile";
import Checkout from "./pages/payment/Checkout";
import CheckoutSuccess from "./pages/payment/CheckoutSuccess";
import CheckoutFailure from "./pages/payment/CheckoutFailure";
import Displaylecture from "./pages/Dashboard/Displaylecture";
import AddLecture from "./pages/Dashboard/AddLecture";
import AdminDashboad from "./pages/Dashboard/AdminDashboard";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
// import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import ChangePassword from "./pages/auth/ChangePassword.jsx";
import ForgotPassword from "./pages/auth/ForgetPassword.jsx";


function App() {
  return (
    <>
      {/* <ForgotPassword/>
    <ResetPassword/> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="/course/description" element={<CourseDescription />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* PROTECTED ROUTE NOW FIXED */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/course/create" element={<CreateCourse />} />
          <Route path="/admin/dashboard" element={<AdminDashboad />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin", "user"]} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/editprofile" element={<EditProfile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/fail" element={<CheckoutFailure />} />
          <Route path="/course/displaylectures" element={<Displaylecture />} />
          <Route path="/course/addlecture" element={<AddLecture />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
