const Message = require('../models/message') 
const Chat = require('../models/chat.js')
const User = require('../models/user')
const cloudinary = require("../utils/cloudinary");

const asyncHandler = require("express-async-handler");

async function getChat(chatid) {
    const userChat = await Chat.findById(chatid, "users messages chatName image")
    .populate("users")
    .populate("image")
    .populate({path: "messages", populate: {path: "writer"}})
    .exec()
    return userChat;
}

// sort them by most recent message sent
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

exports.addToChat = asyncHandler(async (req, res, next) => {
    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            req.params.chatid,
            { $push: { users: req.params.userid } },
            { new: true }
        )
            if (updatedChat) {
                console.log("Add user to chat successfully")
            } else {
                console.log("User could not be added to chat")
            }
        const updatedUser = await updateUserWithChat(req.params.userid, updatedChat)
            if (updatedUser) {
                console.log("Added chat to user successfully")
            } else {
                console.log("Chat could not be added to user")
            }
        return res.json({ success: true, message: "User added to chat!", updatedChat, updatedUser });
    } catch (err) {
        console.log(err, "error")
        next(err)
    }
})

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

exports.changeChatName = asyncHandler(async (req, res) => {
    const updatedChat = await Chat.findByIdAndUpdate(
        req.params.chatid,
        { $set: { chatName: req.body.newChatName }},
        { new: true }
    )
    if (updatedChat) {
        return res.json({ success: true, message: "Chat name updated!"})
    } else {
        return res.json({ success: false, error: "Chat name failed to update!"})
    }
})

exports.changeChatImage = asyncHandler(async (req, res) => {
    try {
        const imageUpload = await cloudinary.uploader.upload(req.file.path);
    
        const updatedChat = await Chat.findByIdAndUpdate(
          req.params.chatid,
          {
            $set: {
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            },
          },
          { new: true }
        );
        res.status(200).json(updatedChat);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
})

exports.sendMessage = asyncHandler(async (req, res) => {
    let date = new Date()
    try {
        const message = {
            dateSent: date,
            writer: req.user._id,
            messageContent: '',
            image: {
                public_id: '',
                url: ''
            }
        }

        if (req.file !== undefined) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path);
            console.log(imageUpload.public_id)
            console.log(imageUpload.secure_url)
            console.log(imageUpload)
            message.image.public_id = imageUpload.public_id
            message.image.url = imageUpload.secure_url
        }

        if (req.body.messageContent) {
            message.messageContent = req.body.messageContent;
        }

        const newMessage = new Message(message);

        await newMessage.save();

        const updatedDocument = await Chat.findByIdAndUpdate(
            req.params.chatid,
            { $push: { messages: newMessage } }, 
            { new: true }
        );

        if (updatedDocument) {
            console.log('Updated document:', updatedDocument);
            return res.json({ success: true, message: "Message saved!" });
        } else {
            console.log('No document found with the specified ID.');
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

    } catch (err) {
        console.log(err)
    }
})

exports.checkIfMessageWriter = asyncHandler(async (req, res, next) => {
    const messageToUpdate = await Message.findById(req.params.messageid)
    let messageWriter = messageToUpdate.writer.toString()
    let requester = req.user._id.toString()
    if (messageWriter !== requester) {
        res.json("Users can only delete their own comments.")
    } else (
        next()
    )
})

exports.deleteMessage = asyncHandler(async (req, res, next) => {
    try {
        const updatedMessage = await Message.findByIdAndUpdate(
            req.params.messageid,
            { $set: { messageContent: "This message has been deleted by it's sender." } },
            { new: true }
        );
        
        if (updatedMessage) {
            console.log('Updated document:', updatedMessage);
            return res.json({ success: true, message: 'Field updated successfully', updatedMessage });
        } else {
            console.log('No document found with the specified ID.');
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
    } catch (err) {
        console.log("error caught!!");
        console.log(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
