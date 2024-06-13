import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads' || process.env.UPLOAD_DIR))
        console.log('Upload directory:', process.env.UPLOAD_DIR); 
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