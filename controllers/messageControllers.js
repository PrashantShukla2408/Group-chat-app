const path = require("path");

const User = require("../models/userModel");
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

exports.getMessages = async (req, res) => {
  const userId = req.userId;
  try {
    const allMessages = await Message.findAll({
      attributes: ["message"],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json({ allMessages: allMessages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting messages" });
  }
};
