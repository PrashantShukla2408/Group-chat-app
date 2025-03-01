const path = require("path");

const User = require("../models/userModel");
const Group = require("../models/groupModel");
const GroupUser = require("../models/groupUserModel");
const GroupMessage = require("../models/groupMessageModel");

exports.createGroup = async (req, res) => {
  try {
    const { groupName, selectedUsers } = req.body;
    const group = await Group.create({
      groupName: groupName,
    });

    const groupUsers = selectedUsers.map((userId) => ({
      groupId: group.id,
      userId: userId,
    }));

    await GroupUser.bulkCreate(groupUsers);
    res
      .status(201)
      .json({ message: "Group created successfully", groupId: group.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating group" });
  }
};

exports.getUserGroups = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userGroups = await Group.findAll({
      attributes: ["groupName", "id"],
      include: [
        {
          model: User,
          attributes: [],
          through: { attributes: [] },
          where: { id: userId },
        },
      ],
    });
    console.log(userGroups);
    res.status(200).json({ userGroups: userGroups });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting groups" });
  }
};

exports.getGroupUsers = async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const groupUsers = await User.findAll({
      attributes: ["name", "id"],
      include: [
        {
          model: Group,
          attributes: [],
          through: { attributes: [] },
          where: { id: groupId },
        },
      ],
    });
    console.log(groupUsers);
    res.status(200).json({ groupUsers: groupUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting group users" });
  }
};

exports.sendGroupMessage = async (req, res) => {
  const { groupId, groupMessage } = req.body;
  const userId = req.userId;

  try {
    const newGroupMessage = await GroupMessage.create({
      groupId: groupId,
      message: groupMessage,
      senderId: userId,
    });
    res.status(201).json({
      message: "Group message sent successfuly",
      messageId: newGroupMessage.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending group message" });
  }
};

exports.getGroupMessages = async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const groupMessages = await GroupMessage.findAll({
      attributes: ["message"],
      where: { groupId: groupId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ groupMessages: groupMessages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting group messages" });
  }
};
