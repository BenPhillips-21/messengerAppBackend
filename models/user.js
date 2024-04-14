const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    bio: {type: String, required: false, default: "This is the default bio"},
    profilePic: { 
        public_id: {
            type: String,
            default: "",
          },
          url: {
            type: String,
            default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
          },
        },
    chats: [{type: Schema.Types.ObjectId, ref: "Chat"}],
    admin: { type: Boolean, default: false }
});

// user should be able to change their username, bio, profilepic

module.exports = mongoose.model("User", UserSchema);