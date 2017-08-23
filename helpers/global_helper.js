
/*
* 汎用的なヘルパーメソッドを記述する
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
    var max, page, count, default_count;
    default_count = typeof params['default_count']==="undefined"?100:parseInt(params['default_count']);
    max = parseInt(params['max']);
    page = typeof params['page']==="undefined"?1:parseInt(params['page']);
    count = typeof params['count']==="undefined"?default_count:parseInt(params['count']);
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

      return {next:page+girth==max_page?false:!next, prev:page-girth==1?false:!prev, nums:nums, page_option: {max:max,page:page,count:count,default_count:default_count}};
    }
  },

  /*
  *
  *
  *
  */

  /**
  *連想配列を下記のフォーマットに変換する
  *[
  *  {key: “a”, value: “abc”},
  *  {key: “b”, value: “def”},
  *  {key: “c”, value: “ghi”}
  *]
  */
  array_associative_format: function(obj, name){
    var arr=[], key_name="key", value_name="value";
    if( name!=undefined ){
      key_name = name['key'];
      value_name = name['value'];
    }
    for(var key in obj) arr.push({[key_name]: key, [value_name]: obj[key]});
    return arr;
  },
  /**
  *フォーマットした連想配列を元に戻す
  */
  array_associative_unformat: function(arr, name){
    var obj={}, key_name="key", value_name="value";
    if( name!=undefined ){
      key_name = name['key'];
      value_name = name['value'];
    }
    for(var i=0;i<arr.length;i++) obj[arr[i][key_name]]=arr[i][value_name];
    return obj;
  }
}
