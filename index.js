// Module imports
require('dotenv').config();
require('express-async-errors');
require('./utils/db');
const express = require('express');
const app = express();
const path = require("path");
const multer = require("multer");
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

// Route imports
const reportRoute = require("./routes/reportRoutes.js");
const authRoute = require('./routes/index.js');
const userRoute = require('./routes/userRoutes.js');
const chatRoute = require('./routes/chatRoutes.js');

// Allowed origins for CORS
const allowedOrigins = [
  process.env.FRONT_END_URL,
  'http://localhost:5173',
  // Add more allowed base origins here
];

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {  // if origin is not defined
        return callback(null, true); // allow requests with no origin 
      }
      // if origin is defined, proceed as normal
      const isAllowedOrigin = allowedOrigins.some(baseOrigin => origin.startsWith(baseOrigin));
      isAllowedOrigin ? callback(null, true) : callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// App configurations
app.use(express.json());
app.use("/files", express.static(path.join(__dirname, "/files")));

// Routes
app.use('/api', authRoute);
app.use("/api/reports", reportRoute);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);

// Multer configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "files"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const uploadLimits = { fileSize: 25 * 1024 * 1024, files: 5 }; // 25 MB
const allowedFileTypesFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf|doc|docx|xlsx|xls/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  mimetype && extname ? cb(null, true) : cb("Error: Only jpeg, png, pdf, Microsoft Word, and Excel files are allowed.");
};
const upload = multer({ storage: storage, limits: uploadLimits, fileFilter: allowedFileTypesFilter });

// File upload route
app.post("/api/upload", async (req, res, next) => {
  try {
    await upload.array("files", 5)(req, res, (err) => {
      if (err) {
        next(err);
      } else {
        const fileNames = req.files.map((file) => file.filename);
        console.log("Sending response with file names:", { fileNames: fileNames });
        res.status(200).json({ fileNames: fileNames });
      }
    });
  } catch (err) {
    next(err);
  }
});

// Error handling middleware for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "File size limit exceeded (25 MB max)." });
  } else if (err && typeof err === "string") {
    return res.status(400).json({ message: err });
  }
  next(err);
});

// Socket.IO configurations
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) {  // if origin is not defined
          return callback(null, true); // allow requests with no origin
        }
        // if origin is defined, proceed as normal
        const isAllowedOrigin = allowedOrigins.some(baseOrigin => origin.startsWith(baseOrigin));
        isAllowedOrigin ? callback(null, true) : callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
});

  
  
  
  
  
  
  

// Socket.IO events
io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);
  socket.on("join", (reportKey) => {
    socket.join(reportKey);
    // console.log(`User ${socket.id} joined room ${reportKey}`);
  });
  socket.on("newMessage", (reportKey, message) => io.in(reportKey).emit("newMessage", message));
  socket.on("disconnect");
  // socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// Error handlers
app.use((req, res, next) => {
  const err = new Error("Route not found");
  err.status = 404;
  next(err);
  console.log(err);
});

app.use((error, req, res, next) => res.status(error.status || 500).json({ error: error.message }));

// Start the server on the specified port
var port = process.env.PORT || 5002;
app.listen(port, function() {
  console.log("App is running on port " + port);
});
