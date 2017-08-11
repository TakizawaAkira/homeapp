var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});
con.connect(function(err) {
  if (err) throw err;

  // データベース再生成クエリ
  var DROP_DATABASE_QUERY = {
    drop_database:
      `DROP DATABASE IF EXISTS homeappdb;`
  };
  var CREATE_DATABASE_QUERY = {
    create_database:
      `CREATE DATABASE homeappdb;`
  };
  // テーブル生成クエリ
  var CREATE_TABLE_QUERY = {
    use_db: `use homeappdb;`,
    create_stock:
      `CREATE TABLE stock (
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        code INT UNIQUE comment '証券コード',
        name VARCHAR(255) comment '名称',
        market VARCHAR(255) comment '市場',
        industry_type VARCHAR(255) comment '業種',
        deleted INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );`,
    create_stock_price_data:
      `CREATE TABLE stock_price_data (
        id MEDIUMINT NOT NULL AUTO_INCREMENT,
        brand_id MEDIUMINT comment '銘柄ID',
        datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '日時',
        stock_price INT comment '株価',
        pre INT comment '前日比',
        pre_per DOUBLE comment '前日比(％)',
        pre_close_price INT comment '前日終値',
        open_price INT comment '始値',
        high_price INT comment '高値',
        low_price INT comment '安値',
        yield INT comment '出来高',
        trading_price INT comment '売買代金(千円)',
        market_capitalization INT comment '時価総額(百万円)',
        price_low_limit INT comment '値幅下限',
        price_upper_limit INT comment '値幅上限',
        deleted INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES stock(id),
        PRIMARY KEY (id)
      );`
  };

  // データベースの初期化
  var QueryResult=(err, result)=>{
    if (err) throw err;
    console.log(`クエリ実行[${new Date().toString()}]:`);
    console.log(result);
  }
  var RunQuerys=querys=>{
    for (key in querys){ con.query(querys[key], QueryResult); }
  }
  RunQuerys(DROP_DATABASE_QUERY);
  RunQuerys(CREATE_DATABASE_QUERY);
  RunQuerys(CREATE_TABLE_QUERY);
});
