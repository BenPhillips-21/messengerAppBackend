const Message = require('../models/message') 
const Chat = require('../models/chat.js')
const User = require('../models/user')

const asyncHandler = require("express-async-handler");

async function getChat(chatid) {
    const userChat = await Chat.findById(chatid, "users messages")
    .populate("users")
    .populate("messages")
    .exec()
    return userChat;
}

exports.getAllChats = asyncHandler(async (req, res) => {
    let allUserChats = []
    for (i = 0; i < req.user.chats.length; i++) {
        let result = await getChat(req.user.chats[i]._id)
        allUserChats.push(result)
    }
    res.json(allUserChats)
})

exports.getOneChat = asyncHandler(async (req, res) => {
    let result = await getChat(req.params.chatid)
    res.json(result)
})

exports.createChat = asyncHandler(async (req, res, next) => {
    const { userid } = req.params;
    const chatUsers = [req.user._id, userid];

    try {
        const chat = new Chat({
            users: chatUsers,
            messages: []
        });
        
        await chat.save();

        await updateUserWithChat(req.user._id, chat);
        await updateUserWithChat(userid, chat);

        return res.json({ success: true, message: "Chat saved!", chat });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

async function updateUserWithChat(userId, chat) {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { chats: chat } },
        { new: true }
    );
    if (updatedUser) {
        console.log('Updated user document:', updatedUser);
    } else {
        console.log('No user document found with the specified ID.');
    }
    return updatedUser;
}

exports.sendMessage = asyncHandler(async (req, res) => {
    // a user that is in the chats user array can only post in that chat
    let date = new Date()
    try {
        const message = new Message({
            dateSent: date,
            writer: req.user,
            messageContent: req.body.messageContent
        })
        await message.save()

        Chat.findByIdAndUpdate(
            req.params.chatid,
            { $push: { messages: message } }, 
            { new: true }
        ).then(updatedDocument => {
            if (updatedDocument) {
                console.log('Updated document:', updatedDocument);
            } else {
                console.log('No document found with the specified ID.');
            }
            return res.json({ success: true, message: "Message saved!"})
        })
    } catch (err) {
        console.log(err)
    }
})

// POST create chat route in which the user adds people they want in the chat