import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  courseData: [],
  loading: false,
  error: null,
};

// ===========================
// Get All Courses
// ===========================
export const getAllCourses = createAsyncThunk(
  "/course/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/courses");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load courses");
      return rejectWithValue(error?.response?.data);
    }
  },
);

// ===========================
// Create New Course
// ===========================
export const createNewCourse = createAsyncThunk(
  "/course/create",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("description", data.description);
      formData.append("createdBy", data.createdBy);
      formData.append("thumbnail", data.thumbnail);

      const response = axiosInstance.post("/courses", formData);

      toast.promise(response, {
        loading: "Creating new course...",
        success: (data) => data?.data?.message,
        error: "Failed to create course",
      });

      return (await response).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data);
    }
  },
);

//delete course
export const deleteCourse=createAsyncThunk("/course/get",async(id)=>{
    try {
        const response=axiosInstance.delete(`/courses/${id}`);
        toast.promise(response,{
            loading:"deleting course...",
            success:"Course deleted successfully",
            error:"Failed to delete course",
        });
        return(await response).data.course;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

// ===========================
// Slice
// ===========================
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET ALL COURSES
      .addCase(getAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courseData = action?.payload?.courses || [];
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // CREATE COURSE
      .addCase(createNewCourse.fulfilled, (state, action) => {
        state.courseData.push(action?.payload?.course);
      });
  },
});

export default courseSlice.reducer;
