const Chat = require('../models/Chat');

exports.loadChat = async (req, res) => {
  const reportKey = req.params.reportKey;

  try {
    const messages = await Chat.find({ reportKey: reportKey }).sort({ createdAt: 1 });

    res.json({ messages: messages, reportKey: reportKey });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.sendMessage = async (req, res) => {
  const reportKey = req.params.reportKey;
  // const { message, senderId, recipientId } = req.body;
  const { message, userID } = req.body;

  try {
    const newMessage = new Chat({
      message: message,
      // reporter: senderId,
      // adminUser: recipientId,
      userID: userID,
      reportKey: reportKey,
    });

    await newMessage.save();

    res.status(200).send('Message sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};