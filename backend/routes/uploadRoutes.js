import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// 1. Configure Storage (Where to save & what to name it)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved in 'backend/uploads'
  },
  filename(req, file, cb) {
    // Name format: fieldname-timestamp.extension
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. Filter to only allow Images
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

// 3. Initialize Multer
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload an image
// @route   POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  // Return the path so the frontend can display it
  // We prepend a forward slash so it matches the static route we will set up in server.js
  res.send(`/${req.file.path.replace(/\\/g, '/')}`); 
});

export default router;