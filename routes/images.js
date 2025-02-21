const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store temporarily in temp directory
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Add file filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Import controllers
const { 
    getImages, 
    createImage, 
    updateImage, 
    deleteImage 
} = require('../controllers/image');

// Routes
router.get('/', getImages);
router.post('/upload', upload.array('files', 10), createImage);  // Changed to 'files' and added limit
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

module.exports = router;
