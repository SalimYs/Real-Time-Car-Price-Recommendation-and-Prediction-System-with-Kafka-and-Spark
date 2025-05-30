const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images/cars/temp')); // Temporary directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG/PNG images are allowed'));
  }
});

// Ensure temp directory exists
const tempDir = path.join(__dirname, '../images/cars/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Get a car by ID
router.get('/:id', carController.getCarById);

// Get all cars with pagination
router.get('/', carController.getAllCars);

// Get latest cars
router.get('/latest', carController.getLatestCars);

// Get recently viewed cars for a user
router.get('/recently-viewed', carController.getRecentlyViewed);

// Record a car view
router.post('/view', carController.recordCarView);

// Create a new car listing
router.post('/', upload.array('images', 10), carController.createCar);

module.exports = router;