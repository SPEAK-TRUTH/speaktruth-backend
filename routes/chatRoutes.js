const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware')
const ChatController = require('../controllers/chatController');
const ChatConversation = require('../models/ChatConversation');

router.get('/:reportKey', authenticateUser, ChatController.getMessages);
router.post('/:reportKey/messages', authenticateUser, ChatController.postMessage);

// Create a new conversation
router.post('/', async (req, res) => {
    console.log(req);
    const { reportKey } = req.body;
    // console.log(reportKey);
    
    try {
      const newConversation = new ChatConversation({ reportKey });
      await newConversation.save();
  
      res.status(201).json(newConversation);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create a new conversation.' });
    }
  });

module.exports = router;
