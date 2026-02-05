 import nodemailer from "nodemailer";

const sendEmail = async (email, subject, message) => {
try {
   // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,

    secure: false, // true for 465, false for others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // email options

  await transporter.verify();

  const mailOptions = {
    from: `"LMS Support" <${process.env.SMTP_USER}>`,
    to:email,
    subject:subject,
    html: message,
  };

  // send email
  await transporter.sendMail(mailOptions);

} catch (error) {
  throw error;
} 
};

export default sendEmail;
