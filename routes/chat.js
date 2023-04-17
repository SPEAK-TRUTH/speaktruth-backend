const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:reportKey', chatController.loadChat);
router.post('/:reportKey/send', chatController.sendMessage);

module.exports = router;