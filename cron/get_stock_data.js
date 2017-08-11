console.log("株価定期取得バッチ開始");

var exec = require('child_process').exec;
var date = new Date();
date.setDate(date.getDate() - 1);
var year = date.getFullYear()
var month = ('0'+(date.getMonth()+1)).slice(-2);
var day = ('0'+date.getDate()).slice(-2);

var get_stock_price_today_shell = `curl -Of https://trial:PW%4020170129@hesonogoma.com/stocks/download/json/japan-all-stock-prices/daily/japan-all-stock-prices_${year}${month}${day}.json`
var mycron = require('cron').CronJob;
var job = new mycron({
  cronTime: '00 00 23 * * *',
  onTick: function() {
    var exec = require('child_process').exec;
    exec('cd ./public/japan_all_stock_prices/ && '+get_stock_price_today_shell, (err, stdout, stderr) => {
      if (err) { console.log(err); }

      console.log(`株価データ取得[${year}${month}${day}]`);
      exec(`node ${__dirname}/save_stock_prices_day.js ${file_name}`, function (err, stdout, stderr) {
        if (err) { console.log(err); }
      });
      console.log(stdout);
    });
  },
  start: false,
});
job.start();
