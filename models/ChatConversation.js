const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  senderRole: {
    type: String,
    enum: ['admin', 'reporter'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatConversationSchema = new Schema({
  reportKey: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [MessageSchema],
});

module.exports = model('ChatConversation', ChatConversationSchema);
