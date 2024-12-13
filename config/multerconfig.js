import multer from "multer";
import path from "path";

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to store files
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create multer instance with storage configuration
const upload = multer({ storage });

export default upload;
