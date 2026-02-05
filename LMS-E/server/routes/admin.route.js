import { Router } from "express";
import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";
import { getAdminAnalytics, getAdminStats } from "../controllers/admin.controller.js";

const router = Router();

// GET ADMIN ANALYTICS (Revenue, Graph, Top courses, etc.)
router.get(
  "/analytics",
  isLoggedIn,
  authorizedRoles("admin"),
  getAdminAnalytics
);

// ⭐ FIXED — STATISTICS ROUTE (Registered users + Enrolled users)
router.get(
  "/stats/users",
  isLoggedIn,
  authorizedRoles("admin"),
  getAdminStats
);

export default router;
