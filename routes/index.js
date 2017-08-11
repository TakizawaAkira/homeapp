var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var sql = `SELECT * FROM stock LIMIT 10;`;
  connection.query(sql, function(err,rows){
    res.render('index', {title: 'root', stocks:rows});
  });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about' });
});

module.exports = router;
