const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs")
const User = require("../models/user");
const cloudinary = require("../utils/cloudinary");
// const upload = require("../middleware/multer");

require('dotenv').config();

const jwt = require("jsonwebtoken");

exports.userSignUp = asyncHandler(async (req, res) => {
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
})

exports.userLogin = asyncHandler(async (req, res) => {
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

  exports.getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await User.find({}, "username profilePic")
    .exec();
    res.json(allUsers)
  })

  exports.getCurrentUser = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user._id, "-password")
    .exec()
    res.json(currentUser)
  })

  exports.updateCurrentUser = asyncHandler(async (req, res) => {
    const update = { $set: {} }

    if (req.body.username) {
      update.$set.username = req.body.username;
  }

    if (req.body.bio) {
        update.$set.bio = req.body.bio;
    }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, update);
  
  if (updatedUser) {
      console.log('Updated user document:', updatedUser);
      return res.json({ success: true, message: 'Field updated successfully', updatedUser });
  } else {
      console.log('No user document found with the specified ID.');
      return res.status(404).json({ success: false, message: 'No user document found with the specified ID.' });
  }
  })

  exports.updateProfilePicture = asyncHandler(async (req, res) => {
    try {
      const imageUpload = await cloudinary.uploader.upload(req.file.path);
  
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            profilePic: {
              public_id: imageUpload.public_id,
              url: imageUpload.secure_url,
            },
          },
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });  

  exports.getUser = asyncHandler(async (req, res) => {
    const requestedUser = await User.findById(req.params.userid, "username bio profilePic")
    .exec()
    res.json(requestedUser)
  })