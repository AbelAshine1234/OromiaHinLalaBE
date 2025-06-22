const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'oromia-hinlala',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => {
      // Generate unique ID by combining original name with timestamp
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      return `${file.originalname}_${timestamp}_${randomString}`;
    },
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = upload; 