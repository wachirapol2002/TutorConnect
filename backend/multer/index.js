// Require multer for file upload
const multer = require('multer');
const path = require('path');


// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.fieldname === 'portrait') {
      callback(null, './static/portraits');
    } else if (file.fieldname == 'document') {
      callback(null, './static/document');
    } else if (file.fieldname == 'selfie') {
      callback(null, './static/selfie');  
    } else {
      callback(new Error('Invalid file type'), false); // ถ้าไฟล์ไม่ตรงกับที่กำหนด
    }
    
  },
  filename: function (req, file, callback) {
    
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

module.exports = upload;
