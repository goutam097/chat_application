const { createGroup } = require("../controllers/groupMessage.controller");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');

const router = require("express").Router();

const uploadDir = 'public/uploads/groups/';  // Ensure proper file structure

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file storage and validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Use the ensured directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1100000 },  // 1MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const isValidMimeType = allowedTypes.test(file.mimetype);
        const isValidExtname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (isValidMimeType && isValidExtname) {
            cb(null, true);
        } else {
            cb(new Error('Only jpeg, jpg, and png files are allowed.'));
        }
    }
});

router.post("/create-group", authMiddleware,upload.single('image'), createGroup);

module.exports = router;
