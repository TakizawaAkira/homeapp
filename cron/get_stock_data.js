console.log("株価定期取得バッチ開始");

var date = new Date();
// date.setDate(date.getDate() - 1); //前日のデータ
var year = date.getFullYear()
var month = ('0'+(date.getMonth()+1)).slice(-2);
var day = ('0'+date.getDate()).slice(-2);

var file_name = `japan-all-stock-prices_${year}${month}${day}.json`;
var get_stock_price_today_shell = `curl -f https://trial:PW%4020170129@hesonogoma.com/stocks/download/json/japan-all-stock-prices/daily/${file_name} --output '${__dirname}/../public/japan_all_stock_prices/${file_name}'`
var mycron = require('cron').CronJob;
var exec = require('child_process').exec;

var job = new mycron({
  cronTime: '00 30 23 * * *',
  onTick: function() {
    console.log(`株価データ取得開始：[${file_name}]`);

    exec(get_stock_price_today_shell, (err, stdout, stderr) => {
      if (err) { console.log(err); }
      console.log(`株価データ取得完了：[${file_name}]`);
      exec(`node ${__dirname}/../scripts/save_stock_prices_day.js ${file_name}`, function (err, stdout, stderr) {
        if (err) { console.log(err); }
        console.log(`株価データストア：[${file_name}]`);
      });
    });
  },
  start: false,
});
job.start();
