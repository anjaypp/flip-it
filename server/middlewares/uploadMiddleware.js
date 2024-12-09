const multer = require("multer");
const storage = require("../utils/storage");

const upload = multer({ storage: storage });

module.exports = upload;
