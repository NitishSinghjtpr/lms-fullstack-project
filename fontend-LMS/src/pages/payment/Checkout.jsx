import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  getRazorpayId,
  purchaseCourseBundle,
  verifyUserPayment,
} from "../../Redux/Slice/RazorpaySlice.js";
import toast from "react-hot-toast";
import HomeLayout from "../../layout/HomeLayout";
import { BiRupee } from "react-icons/bi";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const razorpaykey = useSelector((state) => state?.razorpay?.key);
  const subscription_id = useSelector(
    (state) => state?.razorpay?.subscription_id,
  );
  const isPaymentVerified = useSelector(
    (state) => state?.razorpay?.isPaymentVerified,
  );

  const userData = useSelector((state) => state?.auth?.data);
  const paymentDetails = {
    razorpay_payment_id: "",
    razorpay_subscription_id: "",
    razorpay_signature: "",
  };

  async function handleSubscription(e) {
    e.preventDefault();
    if (!razorpaykey || !subscription_id) {
      toast.error("Something Went Wrong");
      return;
    }
    const options = {
      key: razorpaykey,
      subscription_id: subscription_id,
      name: "Coursify Pvt. Ltd.",
      description: "Subscription",
      theme: {
        color: "#F37254",
      },
      prefill: {
        email: userData.email,
        name: userData.name,
      },
      handler: async function (response) {
        paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
        paymentDetails.razorpay_signature = response.razorpay_signature;

        // Razorpay does NOT return subscription_id, so use redux store one
        paymentDetails.razorpay_subscription_id = subscription_id;

        toast.success("Payment successfull");

        const result = await dispatch(verifyUserPayment(paymentDetails));

        if (result?.payload?.success) {
          navigate("/checkout/success");
        } else {
          navigate("/checkout/fail");
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  async function load() {
    await dispatch(getRazorpayId());
    await dispatch(purchaseCourseBundle());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <HomeLayout>
      <form
        action=""
        onSubmit={handleSubscription}
        className=" min-h-[90vh] flex items-center justify-center text-white"
      >
        <div className=" w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
          <h1 className=" bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl rounded-tl0lg">
            Subscribe Bundle
          </h1>
          <div className=" px-4 space-y-5 text-center">
            <p className="text-[17px]">
              This purchase will allow you to access available course of our
              plateform and {"    "}
              <span className=" text-yellow-500 font-bold">
                1 Year duration{" "}
              </span>
              All the existing and new launched course will bw also available
            </p>
            <p className=" flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
              <BiRupee />
              <span>499</span>Only
            </p>
            <div className=" text-gray-200">
              <p>100% refund on cantilation</p>
              <p>* Term&Cond... applied *</p>
            </div>
            <button
              type="submit"
              className=" bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 w-full bottom-0 left-0 absolute text-xl font-bold rounded-bl-2xl-lg rounded-br-2xl"
            >
              Buy Now
            </button>
          </div>
        </div>
      </form>
    </HomeLayout>
  );
}

export default Checkout;
