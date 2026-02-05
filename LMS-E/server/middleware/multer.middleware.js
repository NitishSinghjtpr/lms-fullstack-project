import multer from "multer";
import path from "path";

const upload = multer({
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      cb(null, file.originalname);
    },
  }),

  fileFilter: (_req, file, cb) => {
    const mime = file.mimetype;

    if (mime.startsWith("image/") || mime.startsWith("video/")) {
      return cb(null, true);
    }

    return cb(new Error("Only images or videos allowed"), false);
  },
});

export default upload;
