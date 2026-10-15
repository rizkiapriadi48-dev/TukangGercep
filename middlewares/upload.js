const multer = require('multer');
const path = require('path');
const { redirectWith } = require('../helpers/helper');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file JPG, PNG, atau WEBP yang diperbolehkan'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB
});

// Middleware yang dipakai di route: menangani error Multer dengan rapi
function uploadPhoto(req, res, next) {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      let message = err.message;
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'Ukuran foto maksimal 2 MB';
      }
      const itemId = req.body && req.body.itemId;
      const back = itemId ? `/items/${itemId}` : '/items';
      return redirectWith(res, back, 'error', message);
    }
    next();
  });
}

module.exports = uploadPhoto;