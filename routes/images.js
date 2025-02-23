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
    // Keep original filename with timestamp
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
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
    getImageById, 
    createImage, 
    updateImage, 
    deleteImage 
} = require('../controllers/image');

// Routes
router.get('/', getImages);
router.get('/:id', getImageById);  // New route for getting single image
router.post('/upload', upload.array('files', 10), createImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

module.exports = router;
