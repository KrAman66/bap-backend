const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");

router.post("/login", asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refreshToken));

// (Optional) Protected logout if you use refresh token store/blacklist
// router.post("/logout", authenticate, asyncHandler(authController.logout));

module.exports = router;
