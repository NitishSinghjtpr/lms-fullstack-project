import { Router } from "express";
import {
  allPayment,
  buySubscription,
  cancleSubscribe,
  getRazorpayApiKey,
  verifySubscription
} from "../controllers/payment.controller.js";

import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

// GET RAZORPAY KEY
router.get("/razorpay-key", isLoggedIn, getRazorpayApiKey);

// CREATE SUBSCRIPTION
router.post("/subscribe", isLoggedIn, buySubscription);

// VERIFY PAYMENT
router.post("/verify", isLoggedIn, verifySubscription);

// CANCEL SUBSCRIPTION
router.post("/unsubscribe", isLoggedIn, cancleSubscribe);

// ADMIN — GET ALL PAYMENTS
router.get("/", isLoggedIn, authorizedRoles("admin"), allPayment);

export default router;
