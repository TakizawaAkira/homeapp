var request = require('request');
var fs = require('fs');
var exec = require('child_process').exec;

// 今日の日付を取得
var date_now = new Date();
date_now.setDate(date_now.getDate() - 1);
var now = {year: date_now.getFullYear(), month: date_now.getMonth()+1, date: date_now.getDate()};

// 日付当日のファイルが存在するか?
var file_name = "japan-all-stock-prices_"+now.year+('0'+now.month).slice(-2)+('0'+now.date).slice(-2)+".json";
var request_url = "https://trial:PW%4020170129@hesonogoma.com/stocks/download/json/japan-all-stock-prices/daily/"+file_name;

console.log(request_url);

request( {method: 'GET', url: request_url, encoding: null},
    function (error, response, body){
        console.log("前日の株データを取得["+request_url+"]");

        if(!error && response.statusCode === 200){
            fs.writeFileSync(__dirname+'/../public/japan_all_stock_prices/'+file_name, body, 'binary');

            exec(`node ${__dirname}/save_stock_prices_day.js ${file_name}`, function (error, stdout, stderr) {
                if(stdout){
                    console.log('stdout: ' + stdout);
                }
                if(stderr){
                    console.log('stderr: ' + stderr);
                }
                if (error !== null) {
                  console.log('Exec error: ' + error);
                }
            });
        }else{
            console.log("> 追加株データ無しor失敗");
            console.log(error);
        }
    }
);
