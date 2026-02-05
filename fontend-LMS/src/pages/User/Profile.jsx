import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../layout/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { cancleCourseBundle } from "../../Redux/Slice/RazorpaySlice";
import { getUserData } from './../../Redux/Slice/AuthSlice';
import toast from "react-hot-toast";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = useSelector((state) => state?.auth?.data);

  async function handleCancellation() {
    toast.loading("Initiating cancellation...");

    // FIX 1 → Correct redux function call
    await dispatch(cancleCourseBundle());
    await dispatch(getUserData()); 

    toast.dismiss();
    toast.success("Cancellation completed!");

    // FIX 2 → correct redirect
    navigate("/");
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] flex items-center justify-center">
        <div className="my-10 flex flex-col rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">

          {/* USER IMAGE */}
          <img
            src={userData?.avatar?.secure_url}
            className="w-40 rounded-full border border-black mx-auto"
            alt=""
          />

          {/* USER NAME */}
          <h3 className="text-xl font-semibold text-center capitalize mt-3">
            {userData?.name}
          </h3>

          {/* USER DETAILS */}
          <div className="grid grid-cols-2 mt-3 gap-y-2">
            <p>Email:</p>
            <p>{userData?.email}</p>

            <p>Role:</p>
            <p>{userData?.role}</p>

            <p>Subscription:</p>
            <p>
              {userData?.subscription?.status?.toLowerCase() === "active"
                ? "Active"
                : "Inactive"}
            </p>
          </div>

          {/* BUTTONS */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link
              to="/changepassword"
              className="w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 text-center"
            >
              Change password
            </Link>

            <Link
              to="/user/editprofile"
              className="w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 text-center"
            >
              Edit profile
            </Link>
          </div>

          {/* Subscribe Button */}
          {userData?.subscription?.status?.toLowerCase() !== "active" && (
            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-3 bg-red-600 hover:bg-red-500 rounded-sm py-2"
            >
              Subscribe
            </button>
          )}

          {/* Cancel Subscription btn (only if ACTIVE) */}
          {userData?.subscription?.status?.toLowerCase() === "active" && (
            <button
              onClick={handleCancellation}
              className="w-full mt-3 bg-red-600 hover:bg-red-500 rounded-sm py-2"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>
    </HomeLayout>
  );
}

export default Profile;
