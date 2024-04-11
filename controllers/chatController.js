const Message = require('../models/message') 
const Chat = require('../models/chat.js')

const asyncHandler = require("express-async-handler");

exports.getAllChats = asyncHandler(async (req, res) => {
    const allChats = await Chat.find({}, "users messages")
    .populate("users")
    .populate("messages")
    .exec();
    res.json(allChats)
})

exports.getOneChat = asyncHandler(async (req, res) => {
    res.json("Get one chat!!!")
})

exports.sendMessage = asyncHandler(async (req, res) => {
    res.json(req.user)
})