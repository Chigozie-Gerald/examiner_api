var fs = require('fs');
var path = require('path');
var multer = require('multer');

let storage = multer.diskStorage({
  destination: process.env.imageFolder,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        path.extname(file.originalname),
    );
  },
});

exports.upload = multer({ storage: storage });
