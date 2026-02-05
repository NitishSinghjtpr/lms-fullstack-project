import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import Payment from "../models/payment.model.js";
import crypto from "crypto";

// ==========================
// GET RAZORPAY KEY
// ==========================
const getRazorpayApiKey = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Razorpay API key",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// ==========================
// BUY SUBSCRIPTION
// ==========================
const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) return next(new AppError("Unauthorized, please login", 400));
    if (user.role === "admin")
      return next(new AppError("Admin cannot purchase a subscription", 400));

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
    });

    // Save subscription info
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscribed Successfully",
      subscription_id: subscription.id,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// ==========================
// VERIFY SUBSCRIPTION PAYMENT
// ==========================
 const verifySubscription = async (req, res, next) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
      subscription_id
    } = req.body;

    const finalSubscriptionId = razorpay_subscription_id || subscription_id;

    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError("Unauthorized", 401));

    // Correct signature verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${finalSubscriptionId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Payment verification failed", 400));
    }

    // Save payment
    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id: finalSubscriptionId
    });

    // Activate user subscription
    user.subscription.id = finalSubscriptionId;
    user.subscription.status = "active";

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    next(error);
  }
};



// ==========================
// CANCEL SUBSCRIPTION
// ==========================
const cancleSubscribe = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) return next(new AppError("Unauthorized, please login", 400));
    if (user.role === "admin")
      return next(new AppError("Admin cannot purchase a subscription", 400));

    const subscriptionId = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    user.subscription.status = subscription.status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// ==========================
// GET ALL PAYMENTS
// ==========================
const allPayment = async (req, res, next) => {
  try {
    const { count } = req.query;

    const subscriptions = await razorpay.subscriptions.all({
      count: count || 10,
    });

    res.status(200).json({
      success: true,
      message: "All payments",
      subscriptions,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancleSubscribe,
  allPayment,
};
