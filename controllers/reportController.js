const crypto = require("crypto");
const Report = require("../models/Report");

// Helper function to generate unique report keys
const generateUniqueReportKey = async () => {
  let reportKey;
  let isUnique = false;

  while (!isUnique) {
    reportKey = crypto.randomBytes(8).toString("hex");
    const existingReport = await Report.findOne({ reportKey });

    if (!existingReport) {
      isUnique = true;
    }
  }

  return reportKey;
};

// Controller function to create a new report
const createReport = async (req, res, next) => {
  // Extract data from request body
  const { subject, incidentDate, department, categories, content } = req.body;

  // Generate a unique report key
  const reportKey = await generateUniqueReportKey();

  // Create a new report object with the extracted data and the generated report key
  const report = new Report({ reportKey, subject, incidentDate, department, categories, content });

  try {
    // Save the report to the database
    await report.save();

    // Send a success response with the generated report key
    res.status(201).json({ message: "Report created successfully", reportKey: reportKey });
  } catch (error) {
    // Send an error response with the error message
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get all reports
const getAllReports = async (req, res, next) => {
  try {
    // Find all reports in the database
    const reports = await Report.find({});

    // Send a success response with the reports
    res.status(200).json({ reports });
  } catch (error) {
    // Send an error response with the error message
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get a report by report key
const getReportByKey = async (req, res, next) => {
  // Extract the report key from the request parameters
  const { reportKey } = req.params;

  try {
    // Find the report in the database by report key
    const report = await Report.findOne({ reportKey });

    // If the report does not exist, send a 404 error response
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Send a success response with the report data
    res.status(200).json(report);
  } catch (error) {
    // Send an error response with the error message
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportByKey
};
