var express = require('express');
var router = express.Router();

const chat_controller = require('../controllers/chatController')
const user_controller = require('../controllers/userController')

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt")

passport.use(jwtStrategy);

const upload = require("../middleware/multer");

router.post("/sign-up", user_controller.userSignUp)

router.post("/login", user_controller.userLogin)

router.post("/demologin", user_controller.demoLogin)

router.get("/allusers", user_controller.getAllUsers) 

router.get("/currentuser", passport.authenticate('jwt', {session: false}), user_controller.getCurrentUser)

router.post("/updatecurrentuser", passport.authenticate('jwt', {session: false}), user_controller.updateCurrentUser)

router.post("/updateprofilepicture", passport.authenticate('jwt', {session: false}), upload.single('image'), user_controller.updateProfilePicture)

router.get("/getuser/:userid", user_controller.getUser)

router.get('/allchats', passport.authenticate('jwt', {session: false}), chat_controller.getAllChats)

router.get('/:chatid', chat_controller.getOneChat)

router.post('/createchat/:userid', passport.authenticate('jwt', {session: false}), chat_controller.createChat)

router.post('/:chatid/sendmessage', passport.authenticate('jwt', { session: false }), upload.single('image'), chat_controller.sendMessage)

router.post("/:chatid/changechatname", passport.authenticate('jwt', { session: false }), chat_controller.changeChatName)

router.post("/:chatid/changechatimage", passport.authenticate('jwt', { session: false }), upload.single('image'), chat_controller.changeChatImage)

router.get('/:messageid/deletemessage', passport.authenticate('jwt', { session: false }), chat_controller.deleteMessage)

router.get('/:chatid/:userid/addtochat', passport.authenticate('jwt', { session: false }), chat_controller.addToChat)

router.get('/:chatid/:userid/kickfromchat', passport.authenticate('jwt', { session: false }), chat_controller.kickFromChat)

module.exports = router;

