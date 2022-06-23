const multer = require("multer");
const path = require("path");
const ApiError = require("../exceptions/apiError")

// генератор случайного имени
const randomHex = (n) => {
    const hex = "0123456789abcdef"
    let res = ""
    for(let i = 0; i < n; i++) {
        res += hex.at(Math.random()*16)
    }
    return res;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!["image/jpg", "image/jpeg"].includes(file.mimetype)) return cb(new ApiError(422, "Only JPG and JPEG images are accepted."), false)
    	cb(null, process.env.LOCAL);
    },
    
    filename: (req, file, cb) => {
        req.body.image_name = randomHex(16) + path.extname(file.originalname)
    	cb(null, req.body.image_name)
    }
})


const upload = multer({
    storage: storage,
    // 5MB
    limits: {fileSize: 5242880},
});

module.exports = upload.single("image")