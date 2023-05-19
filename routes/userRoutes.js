const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authMiddleware");


router.get("/admin-info", authenticateUser, userController.getAdminInfo);


module.exports = router;
