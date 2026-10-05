const multer = require('multer');


const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024     // file size of maximum 3MB files are possible.... 
  }

})

module.exports = upload;