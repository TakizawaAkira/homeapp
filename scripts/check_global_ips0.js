// param: 118.105.135.[*1]
console.log("Search to "+process.argv[2]+"...");

var sys = {
  request: require('request'),
}

var address = process.argv[2];
var check_global_ip = function(address){
  for(var i=1;i<=254;i++){
    var options = {
      url: ((i)=>{
        var protocol = ['http', 'https', 'ftp'];
        var ip = address.replace('[*1]', i);
        var port = [80,81,82,6001,6002,6003,8001,8080,50000,50001,60001];
        return `${protocol[0]}://${ip}`;
      })(i),
      json: true
    }

    //参照ドメイン出力
    //console.log(options.url);

    sys.request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // レスポンス
        //console.log(body);
        console.log(`HitBody[${response.request.href}]: ${response.statusCode}`);
      } else {
        if(response){
          if(response.statusCode == 401){
            // ベーシック認証に失敗
            console.log(`HitAuth[${response.request.href}]: ${response.statusCode}`);
          }else{
            // 通常のエラー
            console.log('error: '+ response.statusCode);
          }
        }else{
          // 接続なし
          //console.log('disconnection...');
        }
      }
    });
  }
};

check_global_ip(address);
