const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const userController = require("../controllers/user.controller.js");

const router = Router();

// My profile
router.get("/me", authMiddleware, userController.getProfile);

// Profile of another user
router.get("/:userId", authMiddleware, userController.getUserProfile);

// Update avatar
router.put("/update-avatar", authMiddleware, userController.updateAvatar);

// Update password
router.put("/update-password", authMiddleware, userController.updatePassword);

// Update status message
router.put("/update-status", authMiddleware, userController.updateStatusMessage);

// Update display name
router.put("/update-name", authMiddleware, userController.updateName);

// Update username
router.put("/update-username", authMiddleware, userController.updateUsername);

// Delete my account (soft delete preferred)
router.delete("/delete", authMiddleware, userController.deleteAccount);

module.exports = router;
