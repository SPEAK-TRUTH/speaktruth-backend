require('dotenv').config()
require('express-async-errors')
require('./utils/db')

const reportRoute = require("./routes/reportRoutes.js");
const authRoute = require('./routes/index.js');
const userRoute = require('./routes/userRoutes.js');
const chatRoute = require('./routes/chatRoutes.js');

const express = require('express')
const app = express()
const port = process.env.PORT
const path = require("path");
const multer = require("multer"); 
const cors = require('cors');

// Import Socket.IO and create server
const http = require('http');
const { Server } = require("socket.io");
const url = require('url');

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://127.0.0.1:5173',
      // Add more allowed base origins here
    ];

    const isAllowedOrigin = allowedOrigins.some(baseOrigin => origin.startsWith(baseOrigin));

    if (isAllowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json())
app.use("/files", express.static(path.join(__dirname, "/files")));

app.use('/api', authRoute);
app.use("/api/reports", reportRoute);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);




// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "files");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
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
  // Route for uploading files
  // app.post("/api/upload", upload.array("files", 5), (req, res) => {
    
  //   res.status(200).json("Allowed files have been uploaded");
  // });

  app.post("/api/upload", async (req, res, next) => {
    try {
      await upload.array("files", 5)(req, res, (err) => {
        if (err) {
          next(err);
        } else {
          const fileNames = req.files.map((file) => file.filename);
          console.log("Sending response with file names:", { fileNames: fileNames });
          res.status(200).json({ fileNames: fileNames }); // Wrap fileNames in an object
        }
      });
    } catch (err) {
      next(err);
    }
  });
  
  // Error handling middleware for Multer file size limit and file filter
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size limit exceeded (25 MB max)." });
    } else if (err && typeof err === "string") {
      return res.status(400).json({ message: err });
    }
    next(err);
  });

  // Replace the app.listen line with the following code
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://127.0.0.1:5173',
        
        // Add more allowed base origins here
      ];

      const isAllowedOrigin = allowedOrigins.some(baseOrigin => origin.startsWith(baseOrigin));

      if (isAllowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
});



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (reportKey) => {
    socket.join(reportKey);
    console.log(`User ${socket.id} joined room ${reportKey}`);
  });

  socket.on("newMessage", (reportKey, message) => {
    io.in(reportKey).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
  


// catch 404 and forward to error handler
app.use((req,res,next) => {
    const err = new Error("Route not found")
    err.status = 404
    next(err)
    console.log(err);
})


//catch all middleware/route
app.use((error, req,res,next) => {
    res.status(error.status || 500).json({ error: error.message })
})

server.listen(port, () => console.log(`Server is running on Port ${port}`));
