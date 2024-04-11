var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
const User = require("../models/user");
const bcrypt = require("bcryptjs")

require('dotenv').config();

const jwt = require("jsonwebtoken");

const passport = require("passport");
const jwtStrategy = require("../strategies/jwt")
passport.use(jwtStrategy);

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/sign-up", async (req, res, next) => {
    if (req.body.password !== req.body.confirmedPassword) {
      return res.status(400).json({ error: 'Password and confirmed password do not match' });
    }
    if (req.body.password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err); 
    } 
    try {
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      });
      const result = await user.save();
      res.json(result);
    } catch(err) {
      return next(err);
    }
  });  
});


router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ success: false, msg: "Could not find user" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, msg: "Incorrect password" });
    }

    const opts = {};
    opts.expiresIn = 60 * 60 * 24;
    const secret = process.env.secret;
    const token = jwt.sign({ username: user.username }, secret, opts);

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
});


router.get("/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).send("YAY! this is a protected Route")
})

module.exports = router;
