import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// ⭐ FINAL PRODUCTION-READY COOKIE OPTIONS
const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,            // ⭐ ALWAYS TRUE in production (Render uses HTTPS)
  sameSite: "none",        // ⭐ required for cross-site cookies
};

// register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new AppError("Email already exists", 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      },
    });

    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });

        if (result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;
          await fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new AppError(
            error?.message ||
              String(error) ||
              "file is not uploaded, please try again",
            500
          )
        );
      }
    }

    await user.save();
    user.password = undefined;

    const token = user.generateToken();
    res.cookie("token", token, cookieOption);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("All fields are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 400);
    }

    const token = user.generateToken();
    user.password = undefined;

    res.cookie("token", token, cookieOption);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    return next(error);
  }
};

// logout
const logout = async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// get profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User Details",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// forgot password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("email is required", 500));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email is not registerd", 400));
  }

  const resetToken = await user.generatePasswordResetToken();
  await user.save();

  const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Reset your password";

  const message = `
  <h2>Password Reset</h2>
  <p>You requested to reset your password.</p>
  <p>
    <a href="${resetPasswordURL}" target="_blank">
       Reset Password
    </a>
  </p>
  <p>${resetPasswordURL}</p>
  <p>This link will expire in 15 minutes.</p>
`;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      message: `Reset password token has been send to ${email} successfully`,
      resetPasswordURL,
    });
  } catch (error) {
    user.forgetPasswordExpiry = undefined;
    user.forgetPasswordToken = undefined;
    await user.save();
    return next(new AppError(error.message, 500));
  }
};

//reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      forgetPasswordToken: hashedToken,
      forgetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Invalid or expired token", 400));
    }

    user.password = password;
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// change password
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const { id } = req.user;
    if (!oldPassword || !newPassword) {
      return next(new AppError("All fields are mandatory", 400));
    }

    const user = await User.findById(id).select("+password");
    if (!user) {
      return next(new AppError("User does not exist", 400));
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return next(new AppError("Invalid old password", 400));
    }

    user.password = newPassword;

    await user.save();
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// update user
const updateUser = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User does not exist", 400));
  }

  if (name) {
    user.name = name;
  }

  if (req.file) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
        await fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(
          error?.message ||
            String(error) ||
            "file is not uploaded, please try again",
          500
        )
      );
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "user details uploaded successfully",
  });
};

export {
  updateUser,
  register,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};
