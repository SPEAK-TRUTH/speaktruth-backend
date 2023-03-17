const router = require("express").Router();

const {
  signUpController,
  signInController,
  resetPasswordRequestController,
  resetPasswordController
} = require("../controllers/auth.controller");

router.post("/auth/signin", signInController);
router.post("/auth/signup", signUpController);
router.post("/auth/requestResetPassword", resetPasswordRequestController);
router.post("/auth/resetPassword", resetPasswordController);

module.exports = router;
