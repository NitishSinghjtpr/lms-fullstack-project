import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './Slice/AuthSlice.js';
import courseSliceReducer from './Slice/CourseSlice.js'
import razorpaySliceReducer from './Slice/RazorpaySlice.js'
import lectureSliceReducer from './Slice/LectureSlice.js'
import statSliceReducer from "./Slice/StatSlice.js"


const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    course:courseSliceReducer,
    razorpay:razorpaySliceReducer,
    lecture:lectureSliceReducer,
    stat:statSliceReducer
  },
  devTools: true
});

export default store;
