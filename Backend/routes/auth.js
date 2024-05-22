const { Router } = require("express");
const router = Router();
const validation = require("../validations/authValidate.js");

const authController = require("../controllers/auth.js");
router.post("/login", validation.loginValidation, authController.login);
router.get("/me", (req, res) => {
  console.log("hello");
  res.send("done");
});
router.post(
  "/register",
  validation.registerValidation,
  authController.register,
  authController.sendOTP
);
router.post("/send-otp", authController.sendOTP);
router.post("/verify", authController.verifyOTP);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
