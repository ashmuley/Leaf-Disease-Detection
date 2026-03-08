const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { detectDisease } = require("../controller/detectDiseaseController");

router.post(
    "/detect-disease",
    upload.array("images", 4),
    detectDisease
);

module.exports = router;