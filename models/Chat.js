const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ChatSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    // reporter: {
    //   type: String, // Reporter ID
    //   required: true,
    // },
    reportKey: {
      type: String,
      required: true,
    },
    userID: {
      type: String, // Admin User ID
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model('Chat', ChatSchema);
