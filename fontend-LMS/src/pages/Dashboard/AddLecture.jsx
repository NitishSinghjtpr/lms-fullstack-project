import React, { useState } from "react";
import HomeLayout from "../../layout/HomeLayout";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addCourseLectures } from "../../Redux/Slice/LectureSlice";

function AddLecture() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation(); 
  const courseId = state?._id;

  const [lectureVideo, setLectureVideo] = useState(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");

  async function handleAddLecture(e) {
    e.preventDefault();

    if (!lectureVideo || !lectureTitle || !lectureDescription) {
      return alert("All fields are required");
    }

    await dispatch(
      addCourseLectures({
        courseId: courseId,
        lecture: lectureVideo,
        title: lectureTitle,
        description: lectureDescription,
      })
    );

    navigate(-1);
  }

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-white p-5">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6">
          Add Lecture to: {state?.title}
        </h1>

        <form
          onSubmit={handleAddLecture}
          className="w-[30rem] p-5 bg-black/40 rounded-lg shadow-lg space-y-5"
        >
          <label className="block">
            <p className="text-yellow-400 mb-1">Lecture Video:</p>
            <input
              type="file"
              name="lecture"
              accept="video/mp4,video/*"
              onChange={(e) => setLectureVideo(e.target.files[0])}
              className="w-full bg-gray-800 p-2 rounded"
              required
            />
          </label>

          <label className="block">
            <p className="text-yellow-400 mb-1">Lecture Title:</p>
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter lecture title"
              className="w-full bg-gray-800 p-2 rounded"
              required
            />
          </label>

          <label className="block">
            <p className="text-yellow-400 mb-1">Lecture Description:</p>
            <textarea
              value={lectureDescription}
              onChange={(e) => setLectureDescription(e.target.value)}
              placeholder="Enter lecture description"
              className="w-full bg-gray-800 p-2 rounded h-24"
              required
            ></textarea>
          </label>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className=" btn btn-secondary hover:btn-secondary px-4 py-2 rounded-md font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              className=" bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold"
            >
              Add Lecture 
            </button>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}

export default AddLecture;
  