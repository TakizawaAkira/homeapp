
/*
* 汎用的なヘルパーメソッドを記載する
*
*/
module.exports = {
  /*
  * ユーザーの利用デバイスの分類(スマホ/PC)
  */
  userAgentType: function(req){
    var device_type = "doesn't match";
    var userAgent = req.headers['user-agent'].toLowerCase();
    if (userAgent.indexOf("android") != -1 || userAgent.indexOf("iphone") != -1 || userAgent.indexOf("ipod") != -1) {
        device_type = 'sp';
    } else {
        device_type = 'pc';
    }
    return device_type;
  },
  /*
  * 簡易的なページネーション配列を取得
  */
  getPagenationNum: function(params){
    var max, page, count;
    max = parseInt(params['max']);
    page = typeof params['page']==="undefined"?1:parseInt(params['page']);
    count = typeof params['count']==="undefined"?100:parseInt(params['count']);
    girth = parseInt(params['girth']);

    if(page*count>max && !count>max){
      return {error: `現在のページ数または全体の要素数が不正です。`}
    }else{
      var prev, next, max_page;
      max_page = Math.ceil(max/count);
      prev = page-girth<1;
      next = page+girth>max_page;

      var start, end;
      if(max_page<(girth*2+1)){
        start = 1;
        end = max_page;
      }else if(prev && !next){
        start = 1;
        end = 1+girth*2;
      }else if(!prev && next){
        start = max_page-girth*2;
        end = max_page;
      }else if(!prev && !next){
        start = page-girth;
        end = page+girth;
      }
      //console.log(`${prev}/${next}`);
      //console.log(`${start}/${end}/${max_page}`);
      var nums = [...Array(end-start+1)].map((v,i)=>i+start);

      return {next:page+girth==max_page?false:!next, prev:page-girth==1?false:!prev, nums:nums, page_option: {max:max,page:page,count:count}};
    }
  }
}
