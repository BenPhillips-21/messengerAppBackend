var express = require('express');
var router = express.Router();

const chat_controller = require('../controllers/chatController')
const user_controller = require('../controllers/userController')

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt")
passport.use(jwtStrategy);

router.post("/sign-up", user_controller.userSignUp)

router.post("/login", user_controller.userLogin)

router.get("/allusers", user_controller.getAllUsers) 

router.get("/currentuser", passport.authenticate('jwt', {session: false}), user_controller.getCurrentUser)

router.get('/allchats', passport.authenticate('jwt', {session: false}), chat_controller.getAllChats)

router.get('/:chatid', chat_controller.getOneChat)

router.post('/createchat/:userid', passport.authenticate('jwt', {session: false}), chat_controller.createChat)

router.post('/:chatid/sendmessage', passport.authenticate('jwt', { session: false }), chat_controller.sendMessage)

router.post("/:chatid/changechatname", passport.authenticate('jwt', { session: false }), chat_controller.changeChatName)

router.get('/:messageid/deletemessage', passport.authenticate('jwt', { session: false }), chat_controller.checkIfMessageWriter, chat_controller.deleteMessage)
// updates the message to say "This message has been deleted."
// user should only be able to delete messages that are their own

router.get('/:chatid/:userid/addtochat', passport.authenticate('jwt', { session: false }), chat_controller.addToChat)

module.exports = router;

