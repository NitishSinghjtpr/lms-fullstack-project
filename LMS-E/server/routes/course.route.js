import { Router } from "express";
import upload from "../middleware/multer.middleware.js";

import {
  addLactureToCourseById,
  createCourse,
  getAllCourse,
  getLactureByCourseId,
  removeCourse,
  updateCourse,
  deleteLecture
} from "../controllers/course.controller.js";

import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router();

/* ===============================
   GET ALL COURSES + CREATE COURSE
================================ */

router
  .route("/")
  .get(getAllCourse)
  .post(
    isLoggedIn,
    authorizedRoles("admin"),
    upload.single("thumbnail"),
    createCourse
  );

/* ===============================
   COURSE OPERATIONS
================================ */

router
  .route("/:id")
  // ⭐ FIX — students can view lectures
  .get(isLoggedIn, getLactureByCourseId)

  // ⭐ only admin
  .put(isLoggedIn, authorizedRoles("admin"), updateCourse)

  // ⭐ only admin
  .delete(isLoggedIn, authorizedRoles("admin"), removeCourse)

  // ⭐ add lecture (admin)
  .post(
    isLoggedIn,
    authorizedRoles("admin"),
    upload.single("lecture"),
    addLactureToCourseById
  );

/* ===============================
   DELETE SINGLE LECTURE
================================ */

router.delete(
  "/:id/lectures/:lectureId",
  isLoggedIn,
  authorizedRoles("admin"),
  deleteLecture
);

export default router;