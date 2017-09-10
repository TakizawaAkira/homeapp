var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("script note!");
});

module.exports = router;
