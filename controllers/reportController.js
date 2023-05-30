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

const createReport = async (req, res) => {
  console.log("Data received from the client:", req.body);

  const {
    subject,
    incidentDate,
    department,
    categories,
    content,
  } = req.body;

  try {
    if (!subject || !incidentDate || !department || !categories || !content) {
      throw new Error("Please enter all required fields");
    }

    let filesArray = [];
    if (req.body.files) {
      console.log("Received files:", req.body.files);
      filesArray = req.body.files.map((file) => ({
        filename: file,
        contentType: "", // You can either leave it empty or try to infer the content type from the file extension
        data: "files/" + file,
      }));
      console.log("Processed files:", filesArray);
    }
        

    const reportKey = await generateUniqueReportKey();

    const report = new Report({
      reportKey,
      subject,
      incidentDate,
      department,
      categories,
      content,
      files: filesArray,
    });
    await report.save();

    res.status(201).json({
      message: "Report created successfully",
      report: {
        reportKey,
        subject,
        incidentDate,
        department,
        categories,
        content,
        files: filesArray,
      },
    });
  } catch (error) {
    console.error("Error in createReport:", error);
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
  getReportByKey,
};
