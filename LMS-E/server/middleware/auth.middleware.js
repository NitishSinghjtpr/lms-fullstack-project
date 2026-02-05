import jwt from "jsonwebtoken";
import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";

// ======================================
// LOGIN CHECK MIDDLEWARE (FIXED)
// ======================================

const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthenticated, please login again", 401));
  }

  // 1️⃣ VERIFY TOKEN
  const payload = jwt.verify(token, process.env.SECRET_KEY);

  // 2️⃣ GET REAL USER FROM DATABASE (🔥 FIXED)
  const user = await User.findById(payload.id);
  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  // 3️⃣ SET REAL USER TO req.user
  req.user = user;

  next();
};

// ======================================
// AUTHORIZATION ROLES (NO CHANGE)
// ======================================

const authorizedRoles =
  (...roles) =>
  async (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!roles.includes(currentUserRole)) {
      return next(new AppError("You do not have permission to access", 403));
    }
    next();
  };

// ======================================
// SUBSCRIBER CHECK (NO CHANGE)
// ======================================

const autherizeSubscriber = async (req, res, next) => {
  const subscription = req.user.subscription;
  const currentUserRole = req.user.role;

  if (currentUserRole !== "admin" && subscription.status !== "active") {
    return next(new AppError("please subscribe to access this route!", 403));
  }
  next();
};

export { isLoggedIn, authorizedRoles, autherizeSubscriber };
