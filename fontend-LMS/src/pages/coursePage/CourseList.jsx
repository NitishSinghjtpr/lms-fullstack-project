import { useDispatch, useSelector } from 'react-redux';
// import { getAllCourses } from '../../Helper/axiosInstance.js';
import { useEffect } from 'react';
import HomeLayout from '../../layout/HomeLayout.jsx';
import CourseCard from './CourseCard.jsx';
import { getAllCourses } from '../../Redux/Slice/CourseSlice.js';

function CourseList() {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);

    async function loadCourse() {
        await dispatch(getAllCourses());
    }

    useEffect(() => {
        loadCourse();
    }, []);

    return (
        <HomeLayout>
            <div className=' min-h-[90vh] pt12 pl-20 flex flex-col gap-10 text-white'>
                
                {/* FIX 1 → H1 properly closed */}
                <h1 className=' text-center text-3xl'>
                    Explore the courses made by
                    <span className=' font-bold text-yellow-500'>
                        Industry expert
                    </span>
                </h1>

                {/* FIX 2 → DIV h1 ke bahar */}
                <div className=' mb-10 flex flex-wrap gap-14'>
                    {courseData.map((element) => {
                        return <CourseCard key={element._id} data={element} />;
                    })}
                </div>

            </div>
        </HomeLayout>
    );
}

export default CourseList;
