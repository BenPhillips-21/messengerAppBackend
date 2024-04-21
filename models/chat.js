const mongoose = require('mongoose');

const Schema = mongoose.Schema

const ChatSchema = new Schema({
    chatName: { type: String, required: false },
    image: { 
        public_id: {
            type: String,
            default: "vvg3y9ummnw2a0mir9fk",
          },
          url: {
            type: String,
            default: "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713316434/vvg3y9ummnw2a0mir9fk.png",
          },
        },
    chad: { type: Schema.Types.ObjectId, ref: "User" },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Chat", ChatSchema);