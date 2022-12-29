const path = require("node:path");
const multer = require("multer");

const storage = multer.diskStorage({
  // Set the destination for this file upload.
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/uploads"));
  },
  // Create a unique file name for this upload.
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExt}`);
  },
});

module.exports = multer({ storage: storage });
