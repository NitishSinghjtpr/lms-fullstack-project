import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  lectures: []
};

// ================================
// Get Course Lectures
// ================================
export const getCourseLectures = createAsyncThunk(
  "/course/lecture/get",
  async (cid) => {
    try {
      const responsePromise = axiosInstance.get(`/courses/${cid}`);

      toast.promise(responsePromise, {
        loading: "Fetching course lecture",
        success: "Lecture fetched successfully",
        error: "Failed to load the lectures",
      });

      const response = await responsePromise;
      return response.data;

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// ================================
// Add Course Lecture
// ================================
export const addCourseLectures = createAsyncThunk(
  "course/addLecture",
  async ({ courseId, lecture, title, description }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("lecture", lecture);       // 🔥 correct key name
      formData.append("title", title);
      formData.append("description", description);

      const response = await axiosInstance.post(
        `/courses/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);


// ================================
// Delete Course Lecture
// ================================
export const deleteCourseLectures = createAsyncThunk(
  "/course/lecture/delete",
  async (data) => {
    try {
      // ✅ FIXED URL — THIS MATCHES TYPICAL BACKEND ROUTES
      const response = axiosInstance.delete(
        `/courses/${data.courseId}/lectures/${data.lectureId}`
      );

      toast.promise(response, {
        loading: "Deleting course lecture",
        success: "Lecture deleted successfully",
        error: "Failed to delete the lectures",
      });

      return (await response).data;

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lectures;
      })
      .addCase(addCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.course?.lectures;
      });
  },
});

export default lectureSlice.reducer;
