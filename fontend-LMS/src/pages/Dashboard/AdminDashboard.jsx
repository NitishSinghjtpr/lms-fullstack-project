import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../layout/HomeLayout";

import {
  Chart as ChartJs,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import { useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { GiMoneyStack } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { MdOutlineHowToReg } from "react-icons/md";

import { getAllCourses } from "../../Redux/Slice/CourseSlice";
import { getStatsData } from "../../Redux/Slice/StatSlice";
import { getPaymentRecord } from "../../Redux/Slice/RazorpaySlice";

ChartJs.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

function AdminDashboard() {
  const dispatch = useDispatch();

  // ⬇ Stats Slice
  const { allUsersCount = 0, subscribedCount = 0 } = useSelector(
    (state) => state.stat,
  );

  // ⬇ Payments Slice
//   const { monthlySalesRecord = [] } = useSelector(
//     (state) => state.razorpay
//   );

const monthlySalesRecord = useSelector(
  (state) => state.stat.monthlySalesRecord
);



  // ⬇ Pie Chart Data
  const userData = {
    labels: ["Registered Users", "Subscribed Users"],
    datasets: [
      {
        data: [allUsersCount, subscribedCount],
        backgroundColor: ["#f4e04d", "#3cb043"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  // ⬇ Sales Bar Chart
  const salesData = {
    labels: [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ],
    datasets: [
      {
        label: "Sales / Month",
        data: monthlySalesRecord,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(getStatsData());
    dispatch(getPaymentRecord());
  }, []);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-5 text-white flex flex-col gap-10">
        <h1 className="text-center text-5xl font-semibold text-yellow-500">
          Admin Dashboard
        </h1>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-2 gap-10 p-6">

          {/* LEFT — PIE CHART */}
          <div className="flex justify-center items-center">
            <div className="w-[23rem] h-[23rem]">
              <Pie data={userData} />
            </div>
          </div>

          {/* RIGHT — STATS CARDS */}
          <div className="flex flex-col gap-6">

            {/* Registered Users */}
            <div className="flex items-center justify-between bg-[#1e1e1e] px-6 py-4 rounded-xl shadow-lg">
              <div>
                <p className="font-semibold text-lg">Registered Users</p>
                <h3 className="text-4xl font-extrabold">{allUsersCount}</h3>
              </div>
              <FaUsers className="text-yellow-500 text-6xl" />
            </div>

            {/* Subscribed Users */}
            <div className="flex items-center justify-between bg-[#1e1e1e] px-6 py-4 rounded-xl shadow-lg">
              <div>
                <p className="font-semibold text-lg">Subscribed Users</p>
                <h3 className="text-4xl font-extrabold">{subscribedCount}</h3>
              </div>
              <MdOutlineHowToReg className="text-green-500 text-6xl" />
            </div>

            {/* Revenue / Subscription Count */}
            <div className="flex items-center justify-between bg-[#1e1e1e] px-6 py-4 rounded-xl shadow-lg">
              <div>
                <p className="font-semibold text-lg">Subscription Count</p>
                <h3 className="text-4xl font-extrabold">
                  {monthlySalesRecord.reduce((a, b) => a + b, 0)}
                </h3>
              </div>
              <GiMoneyStack className="text-orange-400 text-6xl" />
            </div>

          </div>
        </div>

        {/* SALES CHART */}
        <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-lg w-[90%] mx-auto">
          <Bar data={salesData} />
        </div>
      </div>
    </HomeLayout>
  );
}

export default AdminDashboard;
