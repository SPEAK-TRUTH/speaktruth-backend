// Importing required modules
const express = require("express");
const router = express.Router();
const app = express();

// Importing report controller functions
const { createReport, getAllReports, getReportByKey } = require("../controllers/reportController");

// Importing authentication middleware
const { authenticateUser } = require("../middlewares/authMiddleware");

// Importing required modules for file uploads
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filesDirectory = path.join(__dirname, '..', 'files');
    cb(null, filesDirectory);
  },
  
  
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now();
    const filename = `${uniquePrefix}-${file.originalname}`;
    cb(null, filename);
  },
});

// Set limits for file uploads
const uploadLimits = {
  fileSize: 25 * 1024 * 1024, // 25 MB
  files: 5,
};

// Allowed file types filter
const allowedFileTypesFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf|doc|docx|xlsx|xls/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: Only jpeg, png, pdf, Microsoft Word, and Excel files are allowed.");
};

const upload = multer({ storage: storage, limits: uploadLimits, fileFilter: allowedFileTypesFilter });

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes for handling report-related HTTP requests
router.get("/all", authenticateUser, getAllReports); // route for getting all reports
router.get("/get/:reportKey", getReportByKey); // route for getting a specific report by reportKey
router.post("/create", upload.array('files'), createReport); // route for creating a new report

// Exporting the router
module.exports = router;
