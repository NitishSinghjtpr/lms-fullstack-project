// import crypto from "crypto";
// import User from "../models/user.model.js";
// import Payment from "../models/payment.model.js";

// export const handleWebhook = async (req, res) => {
//     try {
//         const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//         const signature = req.headers["x-razorpay-signature"];
//         const body = req.body;

//         // Validate Signature
//         const expectedSignature = crypto
//             .createHmac("sha256", webhookSecret)
//             .update(JSON.stringify(body))
//             .digest("hex");

//         if (signature !== expectedSignature) {
//             return res.status(400).json({ message: "Invalid Webhook Signature" });
//         }

//         // -----------------------------
//         // Handle Subscription Events
//         // -----------------------------

//         if (body.event === "subscription.authenticated") {
//             const subscriptionId = body.payload.subscription.entity.id;

//             const user = await User.findOne({ "subscription.id": subscriptionId });

//             if (user) {
//                 user.subscription.status = "active";
//                 await user.save();
//             }
//         }

//         if (body.event === "subscription.paused") {
//             const subscriptionId = body.payload.subscription.entity.id;

//             const user = await User.findOne({ "subscription.id": subscriptionId });

//             if (user) {
//                 user.subscription.status = "paused";
//                 await user.save();
//             }
//         }

//         if (body.event === "subscription.cancelled") {
//             const subscriptionId = body.payload.subscription.entity.id;

//             const user = await User.findOne({ "subscription.id": subscriptionId });

//             if (user) {
//                 user.subscription.status = "canceled";
//                 await user.save();
//             }
//         }

//         // -----------------------------
//         // Save Payment Info (optional)
//         // -----------------------------
//         if (body.event === "payment.captured") {
//             await Payment.create({
//                 razorpay_payment_id: body.payload.payment.entity.id,
//                 razorpay_signature: "webhook",
//                 razorpay_subscription_id: body.payload.payment.entity.subscription_id || null
//             });
//         }

//         return res.status(200).json({ status: "ok", message: "Webhook processed" });

//     } catch (err) {
//         console.error("Webhook Error:", err.message);
//         return res.status(500).json({ message: "Webhook processing failed" });
//     }
// };
