import { useEffect, useState } from "react";
import HomeLayout from "../../layout/HomeLayout";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  getCourseLectures,
  deleteCourseLectures,
} from "../../Redux/Slice/LectureSlice";

function Displaylectures() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);

  const [currentVideo, setCurrentVideo] = useState(0);

  // ===========================
  // DELETE LECTURE
  // ===========================
  async function onLectureDelete(courseId, lectureId) {
    console.log(courseId, lectureId);

    await dispatch(deleteCourseLectures({ courseId, lectureId }));
    await dispatch(getCourseLectures(courseId));
  }

  // ===========================
  // FETCH LECTURES
  // ===========================
  useEffect(() => {
    if (!state) navigate("/allcourse");


    dispatch(getCourseLectures(state._id));
  }, [state, navigate, dispatch]);

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] pt-10 text-white relative">
        {/* COURSE NAME */}
        <div className="text-center text-2xl font-bold text-yellow-500">
          Course Name: {state?.title}
        </div>

        {/* CHECK IF LECTURES AVAILABLE */}
        {lectures && lectures.length > 0 && (
          <div className="flex justify-center gap-10 w-full">
            {/* LEFT - VIDEO PLAYER */}
            <div className="space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
              <video
                src={lectures[currentVideo]?.video?.secure_url}
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                controls
              />

              <div>
                <h1>
                  <span className="text-yellow-500">Title: </span>
                  {lectures[currentVideo]?.title}
                </h1>

                <p>
                  <span className="text-yellow-500">Description: </span>
                  {lectures[currentVideo]?.description}
                </p>
              </div>
            </div>

            {/* RIGHT - LECTURE LIST */}
            <ul className="w-[28rem] p-2 rounded-lg text-yellow-500 space-y-4 shadow-[0_0_10px_black]">
              {/* HEADER */}
              <li className="font-semibold text-xl flex items-center justify-between">
                <p>Lecture list</p>

                {role === "admin" && (
                  <button
                    onClick={() =>
                      navigate("/course/addlecture", { state: { ...state } })
                    }
                    className="px-3 py-1 text-sm font-medium rounded-md bg-green-500 hover:bg-green-600 text-white shadow-md transition-all duration-200"
                  >
                    Add new lecture
                  </button>
                )}
              </li>

              {/* LIST OF LECTURES */}
              {lectures.map((lecture, idx) => {
                return (
                  <li className="space-y-2" key={lecture._id}>
                    <p
                      className="cursor-pointer"
                      onClick={() => setCurrentVideo(idx)}
                    >
                      <span> Lecture {idx + 1}: </span>
                      {lecture?.title}
                    </p>

                    {/* DELETE BUTTON */}
                    {role === "admin" && (
                      <button
                        onClick={() => onLectureDelete(state._id, lecture._id)}
                        className="px-3 py-1 text-sm font-medium rounded-md bg-red-500 hover:bg-red-600 text-white shadow-md transition-all duration-200"
                      >
                        Delete lecture
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default Displaylectures;
