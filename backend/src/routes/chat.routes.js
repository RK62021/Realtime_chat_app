const {Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware.js');
const ChatController = require('../controllers/chat.controller.js');
 
const router = Router();

router.get('/',authMiddleware, ChatController.getChats);
router.post('/', authMiddleware, ChatController.createChat);

module.exports = router;