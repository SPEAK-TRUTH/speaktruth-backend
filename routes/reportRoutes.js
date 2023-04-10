// Importing required modules
const express = require("express");
const router = express.Router();

// Importing report controller functions
const { createReport, getAllReports, getReportByKey } = require("../controllers/reportController");

// Importing authentication middleware
const { authenticateUser } = require("../middlewares/authMiddleware");

// Routes for handling HTTP requests
router.get("/all", authenticateUser, getAllReports); // route for getting all reports
router.get("/get/:reportKey", getReportByKey); // route for getting a specific report by reportKey
router.post("/create", createReport); // route for creating a new report

// Exporting the router
module.exports = router;
