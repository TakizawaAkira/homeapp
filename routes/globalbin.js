var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("global bin!");
});

module.exports = router;
