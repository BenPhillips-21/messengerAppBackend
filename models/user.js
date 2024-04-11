const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    bio: {type: String, required: false, default: "This is the default bio"},
    profilePic: {type: String, required: false, default: "/public/images/defaultProfilePic.png"},
    friends: [{type: Schema.Types.ObjectId, ref: "User" }],
    chats: [{type: Schema.Types.ObjectId, ref: "Chat"}],
    admin: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", UserSchema);