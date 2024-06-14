import multer from "multer";
import path from "path";
import dotenv from 'dotenv'

dotenv.config();

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
        console.log('Upload directory:', uploadDir); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req:any, file:any, cb:any) => {
    const fileTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimetype = fileTypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true)
    }else{
        cb(new Error('Only images with jpeg, jpg, and png formats are allowed!'))
    }
}

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5}
});

export default upload