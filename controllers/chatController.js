const ChatConversation = require('../models/ChatConversation');

const getMessages = async (req, res) => {
  try {
    const chatConversation = await ChatConversation.findOne({ reportKey: req.params.reportKey });
    if (chatConversation) {
      res.json(chatConversation.messages);
    } else {
      res.status(404).json({ error: 'Chat conversation not found' });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const postMessage = async (req, res) => {
  try {
    const { message, senderRole } = req.body;
    const reportKey = req.params.reportKey;

    let chatConversation = await ChatConversation.findOne({ reportKey });

    if (!chatConversation) {
      chatConversation = new ChatConversation({ reportKey });
    }

    const newMessage = {
      senderRole: senderRole,
      message,
    };
    chatConversation.messages.push(newMessage);
    await chatConversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getMessages,
  postMessage,
};
