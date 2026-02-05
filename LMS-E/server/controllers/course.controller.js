import AppError from "../utils/error.util.js";
import Course from "../models/course.model.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";

//find all courses
const getAllCourse = async function (req, res, next) {
  try {
    const courses = await Course.find({}).select("-lectures");

    res.status(200).json({
      success: true,
      message: "All courses",
      courses,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//find lacture by id
const getLactureByCourseId = async function (req, res, next) {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Invalid course id", 400));
    }
    res.status(200).json({
      success: true,
      message: "Course lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (err) {
    return next(new AppError(err.meaasge, 500));
  }
};

//createCourse
const createCourse = async function (req, res, next) {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail: {
        public_id: "dummy",
        secure_url: "dummy",
      },
    });

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
        });
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;

        await fs.unlink(req.file.path);
      } catch (error) {
        return next(new AppError(error.message, 400));
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//updateCourse
const updateCourse = async function (req, res, next) {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!course) {
      return next(new AppError("course with given id is not exist", 500));
    }

    res.status(200).json({
      success: true,
      message: "course updated successfully",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//removeCourse
const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course with given id does not exist", 404));
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

//addLactureToCourseById
const addLactureToCourseById = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    if (!title || !description) {
      return next(new AppError("All fields are required", 400));
    }

    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError("Course with given ID does not exist", 404));
    }

    const lectureData = {
      title,
      description,
      video: {},
    };

    // 🔥 FIX: Check req.file
    if (!req.file) {
      return next(new AppError("Lecture video is required", 400));
    }

    try {
      // 🔥 FIX: Upload video to cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms-lectures",
        resource_type: "video",
      });

      console.log("REQ FILE → ", req.file);

      lectureData.video.public_id = result.public_id;
      lectureData.video.secure_url = result.secure_url;

      // 🔥 Fix: Remove file from local
      await fs.rm(req.file.path);

    } catch (error) {
      return next(new AppError(error.message, 400));
    }

    course.lectures.push(lectureData);
    course.numberOfLactures = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture successfully added to the course",
      course,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};


// delete lecture
// delete lecture
const deleteLecture = async function (req, res, next) {
  try {
    const { id: courseId, lectureId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    const lecture = course.lectures.id(lectureId);
    if (!lecture) {
      return next(new AppError("Lecture not found", 404));
    }

    // Safely delete video from cloudinary
    if (lecture.video && lecture.video.public_id) {
      await cloudinary.uploader.destroy(lecture.video.public_id, {
        resource_type: "video",
      });
    }

    // remove lecture from array
    course.lectures = course.lectures.filter(
      (lec) => lec._id.toString() !== lectureId,
    );

    course.numberOfLactures = course.lectures.length;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  getAllCourse,
  getLactureByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLactureToCourseById,
  deleteLecture,
};
