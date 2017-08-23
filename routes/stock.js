var express = require('express');
var router = express.Router();

/*
* 銘柄一覧
*/
router.get('/list', function(req, res, next) {
  var device_type = gh.userAgentType(req);

  var stock_history = sh.get_stock_history(req.cookies.stock_history);
  if(stock_history.length>5)stock_history = stock_history.slice(stock_history.length-5);
  var stock_history_codes=[], stock_history_datas=[];
  for(key in stock_history) stock_history_codes.push(stock_history[key]['code']);


  var p = Promise.resolve('start');
  p.then(val=>{return new Promise((resolve,reject)=>{
    // 投資指標詳細の履歴一覧取得
    var sql = `SELECT * FROM stock WHERE code IN(${'"'+stock_history_codes.join('","')+'"'}) ORDER BY FIELD(code,${'"'+stock_history_codes.join('","')+'"'});`;
    connection.query(sql, function(err,rows){
      var associative_stock = gh.array_associative_unformat(stock_history, {key:"code",value:"date"});
      for(var key in rows){
        stock_history_datas.push({
          code: rows[key].code,
          name: rows[key].name,
          view_datetime: associative_stock[rows[key].code]
        });
      }
      resolve(val);
    });
  });}).then(val=>{return new Promise((resolve,reject)=>{
    // 全銘柄の数取得
    var stock_count=0;
    var sql = `SELECT count(*) FROM stock;`;
    connection.query(sql, function(err,rows){
      resolve(rows[0]['count(*)']);
    });
  });}).then(stock_count=>{return new Promise((resolve,reject)=>{
    // 銘柄一覧取得
    var pagenation = gh.getPagenationNum({
      max: stock_count,
      count: req.query.limit,
      page: req.query.page,
      girth: 2,
      default_count: device_type=='sp'?30:100
    });

    sql = `SELECT * FROM stock LIMIT ${pagenation.page_option.count} OFFSET ${(pagenation.page_option.page-1)*pagenation.page_option.count};`;
    connection.query(sql, function(err,rows){
      res.render('stock/index', {
        title: "投資指標データ解析",
        sub_title: "銘柄一覧",
        description: "株価データベースの銘柄",
        stocks: rows,
        page_option: pagenation.page_option,
        pagenation: pagenation,
        device_type: device_type,
        stock_historys: stock_history_datas
      });
    });
  });});



  // var sql = `SELECT count(*) FROM stock;`;
  // connection.query(sql, function(err,rows){
  //   var pagenation = gh.getPagenationNum({
  //     max: rows[0]['count(*)'],
  //     count: req.query.limit,
  //     page: req.query.page,
  //     girth: 2,
  //     default_count: device_type=='sp'?30:100
  //   });
  //
  //   sql = `SELECT * FROM stock LIMIT ${pagenation.page_option.count} OFFSET ${(pagenation.page_option.page-1)*pagenation.page_option.count};`;
  //   var stocks = [];
  //   var list_length = rows[0]['count(*)'];
  //
  //   connection.query(sql, function(err,rows){
  //     stocks = rows;
  //
  //     res.render('stock/index', {
  //       title: "投資指標データ解析",
  //       sub_title: "銘柄一覧",
  //       description: "株価データベースの銘柄",
  //       stocks: stocks,
  //       page_option: pagenation.page_option,
  //       pagenation: pagenation,
  //       device_type: device_type
  //     });
  //   });
  // });
});


/*
* 投資指標データ詳細
*/
router.get('/show_datas', function(req, res, next) {
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
      //詳細閲覧履歴に追加
      stock_history = sh.add_stock_history(req.cookies.stock_history, rows[0].code);
      res.cookie('stock_history', stock_history, {maxAge:60*60*60*24*3, httpOnly:false});

      sql = `SELECT * FROM stock_price_data WHERE brand_id=${rows[0].id} ORDER BY datetime`;

      connection.query(sql, function(err,rows){
        stock_price_datas = rows;

        res.render('stock/show', {
          title: "投資指標データ解析",
          sub_title: `${stock.name}&nbsp;<span class="badge badge-success">${stock.code}</span>`,
          description: "投資指標の各種詳細データ",
          code: req.query.stock_code,
          stock: stock,
          stock_price_datas: stock_price_datas,
          columns: columns,
          device_type: gh.userAgentType(req),
          last_stock_price_data: stock_price_datas.slice(-1)[0]
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
