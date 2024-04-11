var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const chat_controller = require('../controllers/chatController')
const user_controller = require('../controllers/userController')

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt")
passport.use(jwtStrategy);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/sign-up", user_controller.userSignUp)

router.post("/login", user_controller.userLogin)

router.get("/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).send("YAY! this is a protected Route")
})

// Get all chats route
router.get('/allchats', chat_controller.getAllChats)
// returns all chats which include the logged in user's id
// let frontend handle distinguish between who sent what ....

// Get specific chat route
router.get('/:chatid', chat_controller.getOneChat)

// Post message to chat route
router.post('/:chatid/sendmessage', passport.authenticate('jwt', { session: false }), chat_controller.sendMessage)
// Delete message from chat route

module.exports = router;

