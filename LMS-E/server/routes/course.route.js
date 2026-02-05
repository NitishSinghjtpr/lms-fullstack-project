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
import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

// GET all courses + create course
router
  .route("/")
  .get(getAllCourse)
//   .post(
//   isLoggedIn,
//   authorizedRoles("admin"),
//   upload.single("thumbnail"),  // ✔ FIXED
//   createCourse
// )
.post(isLoggedIn,authorizedRoles("admin"),upload.single("thumbnail"),createCourse)


// GET/UPDATE/DELETE/ADD lecture
router
  .route("/:id")
  .get(isLoggedIn, authorizedRoles("admin"), getLactureByCourseId)
  .put(isLoggedIn, authorizedRoles("admin"), updateCourse)
  .delete(isLoggedIn, authorizedRoles("admin"), removeCourse)
  .post(
    isLoggedIn,
    authorizedRoles("admin"),
    upload.single("lecture"),
    addLactureToCourseById
  )
  router.delete("/:id/lectures/:lectureId", isLoggedIn, authorizedRoles("admin"), deleteLecture);

  

export default router;
