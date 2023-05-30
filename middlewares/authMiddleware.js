const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const reportKeyHeader = req.headers["x-report-key"];

  if (!authHeader && !reportKeyHeader) {
    return res.status(401).json({ error: "No authorization header provided" });
  }

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  } else {
    // Handle the x-report-key for the reporter role
    req.reportKey = reportKeyHeader;
    next();
  }
};


module.exports = {
  authenticateUser
};
