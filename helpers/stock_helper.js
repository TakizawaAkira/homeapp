
/*
* 投資指標解析ヘルパーメソッドを記述する
* global.gh = require('./helpers/stock_helper');が必須
*/
module.exports = {
  /* test */
  get_test: function(max, min){
    return Math.floor( Math.random() * (max + 1 - min) ) + min;
  },
  /*
  * 閲覧履歴の取得
  */
  get_stock_history: function(stock_history){
    if(typeof stock_history !== "undefined"){
      stock_history = JSON.parse(stock_history);
    }

  	// NOTE: 連想配列の件数絞り込みがわからないため一旦配列形式にする。
  	stock_history = gh.array_associative_format(stock_history, {key:"code",value:"date"});
  	return stock_history.sort(function(a,b) {
      if( a.date < b.date ) return 1;
      if( a.date > b.date ) return -1;
      return 0;
    });
  },
  /*
  * 閲覧履歴の保存
  */
  add_stock_history: function(stock_history, stock_code){
    if(typeof stock_history !== "undefined"){
      stock_history = JSON.parse(stock_history);
    }else{
      stock_history = {};
    }

  	// NOTE: 連想配列の件数絞り込みがわからないため一旦配列形式にする。
  	stock_history = gh.array_associative_format(stock_history, {key:"code",value:"date"});
  	// 投資指標詳細の閲覧履歴の追加
  	stock_history.push({
  		code: stock_code,
  		date: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss')
  	});
  	// 投資指標詳細の閲覧履歴を30件に収める
  	if(Object.keys(stock_history).length>30){
  		stock_history = stock_history.slice(stock_history.length-30);
  	}
  	stock_history = gh.array_associative_unformat(stock_history, {key:"code",value:"date"});
  	return JSON.stringify(stock_history);
  }
}
