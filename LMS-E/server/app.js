import express from "express";
import { config } from "dotenv";
config();

import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/route.js";
import courseRoutes from "./routes/course.route.js";
import paymentRoutes from "./routes/payment.route.js";
import contactRoutes from "./routes/contact.route.js";
import adminRoutes from "./routes/admin.route.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://lms-fullstack-project-wa1v.onrender.com"
    ],
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    
  })
);




// Test Route
app.get("/ping", (_, res) => {
  res.send("pong");
});

// ⭐ ALL API ROUTES SHOULD COME BEFORE 404
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/contact", contactRoutes);

// ✔ FIX — Admin route must be BEFORE 404
app.use("/api/v1/admin", adminRoutes);

// 404 must be LAST
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// Error middleware
app.use(errorMiddleware);

export default app;
