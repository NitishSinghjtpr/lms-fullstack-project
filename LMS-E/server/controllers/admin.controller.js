import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Payment from "../models/payment.model.js";

// ------------------------------
// ADMIN ANALYTICS (FULL DASHBOARD)
// ------------------------------
export const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1️⃣ Total counts
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();

    const courses = await Course.find({});
    const totalLectures = courses.reduce(
      (acc, course) => acc + (course.lectures?.length || 0),
      0
    );

    // 2️⃣ Subscriptions
    const activeSubs = await User.countDocuments({
      "subscription.status": "active",
    });
    const inactiveSubs = totalUsers - activeSubs;

    // 3️⃣ Revenue
    const payments = await Payment.find({});
    const totalRevenue = payments.length * 199; // Assume ₹199 subscription

    // 4️⃣ Monthly revenue graph
    const graphData = {};
    payments.forEach((payment) => {
      const month = new Date(payment.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!graphData[month]) graphData[month] = 0;
      graphData[month] += 199;
    });

    // 5️⃣ Top courses by lecture count
    const topCourses = courses
      .sort((a, b) => b.numberOfLactures - a.numberOfLactures)
      .slice(0, 5)
      .map((course) => ({
        title: course.title,
        lectures: course.numberOfLactures,
        thumbnail: course.thumbnail.secure_url,
      }));

    // RESPONSE
    return res.status(200).json({
      success: true,
      message: "Admin Analytics Fetched",
      analytics: {
        totalUsers,
        totalCourses,
        totalLectures,
        subscriptionStats: {
          active: activeSubs,
          inactive: inactiveSubs,
        },
        totalRevenue,
        monthlyRevenue: graphData,
        monthlySalesRecord: Object.values(graphData),
        topCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// ADMIN USER STATS (Pie Chart Data)
// ------------------------------
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const subscribedUsers = await User.countDocuments({
      "subscription.status": "active",
    });

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      allUsersCount: totalUsers,
      subscribedUserCount: subscribedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
