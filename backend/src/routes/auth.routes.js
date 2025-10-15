const {Router} = require('express');
const AuthController = require('../controllers/auth.controller.js');
const router = Router();
const passport = require('../config/googleStrategy.js');
const authMiddleware = require('../middleware/auth.middleware.js');

// Auth routes

// user data for state management
router.get('/me', authMiddleware, AuthController.getUserData);


// Registration route   
router.post('/register', AuthController.register);

// Login route
router.post('/login', AuthController.login);

// // Token refresh route
router.post('/refresh-token', AuthController.refreshAccessToken);

// Logout route
router.post('/logout', AuthController.logout);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }), AuthController.googleCallback);

// username availability check
router.get('/username-availability/:username', AuthController.UsernameAvailability);

// set username for OAuth users
router.post("/set-username", authMiddleware, AuthController.setUsername);


module.exports = router;