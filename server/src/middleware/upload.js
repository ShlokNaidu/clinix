import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // ✅ 2MB limit (MATCHES frontend)
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only images allowed")
      );
    }
    cb(null, true);
  }
});

export default upload;
