var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "homeappdb"
});
con.connect(function(err) {
  if (err) {
    console.log("homeappdb DB接続エラー");
    throw err;
  }

  var folderpath = `${__dirname}/../public/japan_all_stock_prices`;
  fs.readdir(folderpath, function (err, filelist) {
    if (err) {
      console.error(err);
      process.exit(1);
    }　else {
      // 全ての投資指標データを登録
      for (var i = 0; i < filelist.length; i++) {
        var filepath = `${folderpath}/${filelist[i]}`;

        var timeout_save_stock = function(filepath){

        };
        setTimeout(function(filepath){
          if(path.extname(filepath) === '.json'){
            fs.readFile(filepath, 'utf8', function(err, text){
              var stock_price_datas = JSON.parse(text||"null")['japan-all-stock-prices'];

              console.log("読み込み開始："+filepath);
              for (var i=0;i<stock_price_datas.length;i++){
                save_stock(stock_price_datas[i]);
              }
            });
          }
        }, i*10000, filepath);
      }
    }
  });


  // Stockデータの追加
  function save_stock(stock_price_data){
    var stock = {};
    stock['column_name_list_i18n'] = {
      code: "証券コード",
      name: "名称",
      market: "市場",
      industry_type: "業種"
    }
    stock['column_name_comma'] = Object.keys(stock['column_name_list_i18n']).join(',');
    stock['dates_comma'] = '"'+stock_price_data.slice(0,4).join('","')+'"';

    con.query(`INSERT INTO stock(${stock['column_name_comma']}) VALUE(${stock['dates_comma']});`, function(err, result){
      if (err){
        con.query(`SELECT id FROM stock WHERE code=${stock_price_data[0]};`, function(err, result){
          save_stock_price(result[0].id, stock_price_data);
        });
      }else{
        save_stock_price(result.insertId, stock_price_data);
      }
    });
  }

  // StockPriceデータの追加
  function save_stock_price(parent_id, stock_price_data){
    var stock_price = {};
    stock_price['column_name_list_i18n'] = {
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
      price_upper_limit: "値幅上限"
    };
    stock_price['column_name_comma'] = Object.keys(stock_price['column_name_list_i18n']).join(',');
    stock_price['dates_comma'] = ('"'+stock_price_data.slice(4).join('","')+'"').replace( /"-"/g , 'null' ); //一旦文字列から"-"をnullにする

    con.query(`INSERT INTO stock_price_data(brand_id,${stock_price['column_name_comma']}) VALUE("${parent_id}",${stock_price['dates_comma']});`, function(err, result){
      if(err){
        console.log(`※追加済み株式投資指標データ: ${filepath}`);
        console.log(err.sql);
      }

      process.stdout.write("|");
    });
  }
});
