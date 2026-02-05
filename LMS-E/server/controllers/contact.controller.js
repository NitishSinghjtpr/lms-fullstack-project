import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";
import Contact from "../models/contact.model.js";

export const contactController = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return next(new AppError("All fields are required", 400));
    }

    // Save to MongoDB
    await Contact.create({ name, email, message });

    // Send Email
    const subject = `New Contact Message from ${name}`;
    const htmlMessage = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendEmail(process.env.SMTP_USER, subject, htmlMessage);

    res.status(200).json({
      success: true,
      message: "Message submitted successfully!",
    });

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
