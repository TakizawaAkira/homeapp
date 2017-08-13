var express = require('express');
var router = express.Router();

/*
* 銘柄一覧
*/
router.get('/list', function(req, res, next) {
  var sql = `SELECT count(*) FROM stock;`;
  connection.query(sql, function(err,rows){
    var page_option = {
      page: typeof req.query.page==="undefined"?1:req.query.page,
      limit: typeof req.query.limit==="undefined"?100:req.query.limit,
      max: rows[0]['count(*)']
    };
    var pagenation = require("../helpers/pagenation")({
      page: page_option.page,
      count: page_option.limit,
      max: page_option.max,
      girth: 2
    });
    console.log(pagenation);

    sql = `SELECT * FROM stock LIMIT ${page_option.limit} OFFSET ${(page_option.page-1)*page_option.limit};`;
    var stocks = [];

    connection.query(sql, function(err,rows){
      stocks = rows;

      res.render('stock/index', {
        title: "銘柄一覧",
        sub_title: "銘柄一覧",
        description: "株価データベースの銘柄",
        stocks: stocks,
        page_option: page_option,
        pagenation: pagenation
      });
    });
  });
});

/*
* 投資指標データ詳細
*/
router.get('/show_datas', function(req, res, next) {
  if(typeof req.query.stock_code === "undefined"){
    res.render('stock/error', {
      title: "エラーページ",
      error_message: "開発：URL上に証券コード('stock_code')が存在しません",
      support_message: "URL上の証券コードを確認の上、下記より再度アクセスしてください"
    });
    return;
  }

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
    stock = rows[0];

    if(!err && stock){
      sql = `SELECT * FROM stock_price_data WHERE brand_id=${rows[0].id}`;

      connection.query(sql, function(err,rows){
        stock_price_datas = rows;

        res.render('stock/show', {
          title: "投資指標詳細",
          sub_title: `[${stock.code}]&nbsp;${stock.name}`,
          description: "投資指標の各種詳細データ",
          code: req.query.stock_code,
          stock: stock,
          stock_price_datas: stock_price_datas,
          columns: columns
        });
      });
    }else{
      res.render('stock/error', {
        title: "エラーページ",
        error_message: "Sorry, 証券コード('stock_code')が違います。",
        support_message: "URL上の証券コードを確認の上、下記より再度アクセスしてください"
      });
    }
  });
});

router.get('/error', function(req, res, next) {
  res.render('stock/error', {
    title: "エラーページ",
    error_message: req.query.error_message,
    support_message: req.query.support_message
  });
});

module.exports = router;
