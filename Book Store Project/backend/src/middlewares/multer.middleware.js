import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

export default upload;
