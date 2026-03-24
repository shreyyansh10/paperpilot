const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');
const otpController = require('../controllers/otpController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', googleAuthController.googleLogin);
router.get('/me', verifyToken, authController.getMe);
router.post('/send-otp', otpController.sendOTP);
router.post('/verify-otp-only', otpController.verifyOTPOnly);
router.post('/verify-otp', otpController.verifyOTPAndRegister);

module.exports = router;