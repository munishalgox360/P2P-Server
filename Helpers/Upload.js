const multer = require("multer");


const storage = multer.diskStorage({
    destination : function(req, file, callback){
        callback(null, "Public/");
    },

    filename : function(req, file, callback){
        callback(null, file.fieldname + file.originalname);
    }
});

const upload = multer({ storage : storage });

module.exports = upload;