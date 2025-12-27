const { Router } = require('express');
const router = Router();

// import routes
const auth = require('./auth.routes.js');
const user = require('./user.routes.js');
const chat = require('./chat.routes.js');

// use routes
router.use('/auth', auth); // auth routes
router.use('/user', user); // user routes
router.use('/chat', chat); // chat routes

module.exports = router;
