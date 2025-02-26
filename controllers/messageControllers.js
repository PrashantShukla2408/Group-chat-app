const path = require("path");

const { Op } = require("sequelize");

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
    res.status(201).json({
      message: "Message sent successfully",
      messageId: newMessage.messageId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending message" });
  }
};

exports.getMessages = async (req, res) => {
  const userId = req.userId;
  try {
    const allMessages = await Message.findAll({
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

exports.getOlderMessages = async (req, res) => {
  const oldestMessageId = req.query.oldestMessageId;
  const userId = req.userId;

  try {
    const olderMessages = await Message.findAll({
      where: {
        messageId: { [Op.lt]: oldestMessageId },
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    console.log(olderMessages);
    res.status(200).json({ olderMessages: olderMessages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting older messages" });
  }
};
