
/*
* 汎用的なヘルパーメソッドを記載する
*
*/
module.exports = {
  userAgentType: function(req){
    var device_type = "doesn't match";
    var userAgent = req.headers['user-agent'].toLowerCase();
    if (userAgent.indexOf("android") != -1 || userAgent.indexOf("iphone") != -1 || userAgent.indexOf("ipod") != -1) {
        device_type = 'sp';
    } else {
        device_type = 'pc';
    }
    return device_type;
  }
}
