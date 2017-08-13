module.exports = function(params) {
  for(k in params) this[k]=params[k];

  if(page*count>max && !count>max){
    return {error: `現在のページ数または全体の要素数が不正です。`}
  }else{
    var prev, next, max_page;
    max_page = Math.ceil(max/count);
    prev = page-girth<1;
    next = page+girth>max_page;
    console.log(`${page}/${girth}`);

    var start, end;
    page = parseInt(page);
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
    console.log(`${prev}/${next}`);
    console.log(`${start}/${end}/${max_page}`);
    var nums = [...Array(end-start+1)].map((v,i)=>i+start);

    return {next:page+girth==max_page?false:!next, prev:page-girth==1?false:!prev, nums:nums};
  }
}
