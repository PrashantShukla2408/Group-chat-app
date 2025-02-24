const path = require("path");

const Message = require("../models/messageModel");

exports.sendMessage = async (req, res) => {
  const userId = req.userId;
  const message = req.body.message;

  try {
    const newMessage = await Message.create({
      UserId: userId,
      message: message,
    });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending message" });
  }
};
