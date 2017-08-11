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

router.get('/stock_list', function(req, res, next) {
  var sql = `SELECT * FROM stock LIMIT 100;`;
  var stocks = [];

  connection.query(sql, function(err,rows){
    stocks = rows;

    res.render('stock_list', {stocks: stocks});
  });
});

router.get('/stock_analysis', function(req, res, next) {
  var sql = `SELECT * FROM stock WHERE code=${req.query.stock_code} LIMIT 1;`;
  var stock = {};
  var stock_price_datas = [];
  var columns = {
    id: "ID",
    brand_id: "銘柄ID",
    datetime: "日時",
    stock_price: "株価",
    pre: "前日比",
    pre_per: "前日比(％)",
    pre_close_price: "前日終値",
    open_price: "始値",
    high_price: "高値",
    low_price: "安値",
    yield: "出来高",
    trading_price: "売買代金(千円)",
    market_capitalization: "時価総額(百万円)",
    price_low_limit: "値幅下限",
    price_upper_limit: "値幅上限",
    deleted: "削除フラグ",
    created_at: "作成日",
    updated_at: "更新日"
  }

  connection.query(sql, function(err,rows){
    if(err) throw err;
    console.log(rows);
    stock = rows[0];

    if(stock){
      sql = `SELECT * FROM stock_price_data WHERE brand_id=${rows[0].id}`;

      connection.query(sql, function(err,rows){
        stock_price_datas = rows;

        res.render('stock_price_analysis', {
          code: req.query.stock_code,
          stock: stock,
          stock_price_datas: stock_price_datas,
          columns: columns
        });
      });
    }else{
      res.render('error', {code: req.query.stock_code});
    }
  });
});

module.exports = router;
