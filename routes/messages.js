var express = require('express');
var router = express.Router();

/* GET messages */
router.get('/', function(req, res, next) {
  res.send('messages!!!');
});

// POST a message (adds it to chat array)

// GET all messages

module.exports = router;