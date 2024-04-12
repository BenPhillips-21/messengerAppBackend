var express = require('express');
var router = express.Router();

const chat_controller = require('../controllers/chatController')
const user_controller = require('../controllers/userController')

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt")
passport.use(jwtStrategy);

router.get("/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).send("YAY! this is a protected Route")
})

router.post("/sign-up", user_controller.userSignUp)

router.post("/login", user_controller.userLogin)

router.get("/allusers", user_controller.getAllUsers) 

router.get("/currentuser", passport.authenticate('jwt', {session: false}), user_controller.getCurrentUser)

router.get('/allchats', chat_controller.getAllChats)

// Get specific chat route
router.get('/:chatid', chat_controller.getOneChat)

router.post('/createchat/:userid', passport.authenticate('jwt', {session: false}), chat_controller.createChat)

// Post message to chat route
router.post('/:chatid/sendmessage', passport.authenticate('jwt', { session: false }), chat_controller.sendMessage)
// Delete message from chat route

module.exports = router;

