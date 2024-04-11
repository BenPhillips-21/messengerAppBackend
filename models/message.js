const mongoose = require('mongoose');

const Schema = mongoose.Schema

const MessageSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    dateSent: {type: Date, required: true},
    messageContent: {type: String, required: true} 
    // Media (add later)
});

module.exports = mongoose.model("Message", MessageSchema);