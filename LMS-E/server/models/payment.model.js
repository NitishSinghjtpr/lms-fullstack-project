import {model, Schema } from "mongoose";

const paymentSchema = new Schema({
  razorpay_payment_id: String,
  razorpay_signature: String,
  razorpay_subscription_id: String,
  amount: {
    type: Number,
    default: 199
  }
}, { timestamps: true });


const Payment=model('payment',paymentSchema);
export default Payment;