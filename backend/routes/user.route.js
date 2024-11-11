const { register, login, getAllUser, updateDetails, getUserDetails } = require("../controllers/user.controller");
const multer = require('multer');
const path = require('path');
const router = require("express").Router();

// Set up Multer for image handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1100000 }, // 1MB limit
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


router.post("/register", register)
router.post("/login", login)
router.get("/allUserList/:id", getAllUser)
router.get('/userDetails/:id', getUserDetails);
router.post('/updateDetails/:id', upload.single('image'), updateDetails);


module.exports = router;