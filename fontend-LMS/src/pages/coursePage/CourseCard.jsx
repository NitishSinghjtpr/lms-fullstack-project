import { useNavigate } from "react-router";

function CourseCard({ data }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/course/description",{state:{...data}})}
      className="cursor-pointer group w-[22rem] h-[460px] bg-zinc-800 rounded-xl shadow-xl overflow-hidden border border-zinc-700 hover:border-yellow-500 transition-all"
    >
      {/* Thumbnail */}
      <div className="overflow-hidden">
        <img
          src={data?.thumbnail?.secure_url}
          alt="Course thumbnail"
          className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 text-white">
        <h2 className="text-xl font-bold text-yellow-400 line-clamp-2 group-hover:text-yellow-300 transition-all">
          {data?.title}
        </h2>

        <p className="text-sm text-gray-300 line-clamp-2">
          {data?.description}
        </p>

        {/* Details */}
        <div className="space-y-1 text-sm font-semibold">
          <p>
            <span className="text-yellow-400">Category: </span>
            {data?.category}
          </p>

          <p>
            <span className="text-yellow-400">Total Lectures: </span>
            {data?.numberOfLactures || data?.numberoflectures}
          </p>

          <p>
            <span className="text-yellow-400">Instructor: </span>
            {data?.createdBy}
          </p>
        </div>

        {/* Bottom highlight bar */}
        <div className="w-full h-[3px] bg-zinc-700 group-hover:bg-yellow-500 transition-all"></div>
      </div>
    </div>
  );
}

export default CourseCard;
