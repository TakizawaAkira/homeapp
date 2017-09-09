
/*
* 投資指標データ解析
*/

var match_pattern_table = document.getElementById("match_pattern_table");

// 計算類
var final_prices_zero = stock_price_datas.map(function(arr){return arr['pre_close_price']});
var getCenter = function(a,b){return (a+b)/2;};
var fpz=final_prices_zero, pInt=parseInt, fluctua_sum=0;

for(var i=0;i<fpz.length-2;i++){
  score = pInt(fpz[i+1])-getCenter(pInt(fpz[i+0]), pInt(fpz[i+2]))
  fluctua_sum += score<0? score*-1: score;
}
var fluctua = fluctua_sum/fpz.length;

var datas = {};
var judge=[], fluctua_values=[], s=[];

for(var i=0;i<fpz.length-2;i++){
  var price0 = parseInt(fpz[i]);
  var price1 = parseInt(fpz[i+1]);
  var price2 = parseInt(fpz[i+2]);

  var centerA = getCenter(price0, price1);
  var centerB = getCenter(price1, price2);
  var centerC = getCenter(price0, price2);

  var fluctua = price1-centerC;
  if(Math.abs(fluctua) < fluctua/3 || parseInt(fluctua)==0){
    //買い時検出を一旦テーブル化
    var row = match_pattern_table.insertRow(-1);
    cell = row.insertCell(-1);
    cell.innerHTML = i
    //日付
    var cell = row.insertCell(-1);
    var now = new Date(stock_price_datas[i]['datetime']);
    var dateformat_now = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}`;
    cell.innerHTML = dateformat_now;
    //5日以内の変動値
    cell = row.insertCell(-1);
    var check_i = 10;
    var pre5 = [];
    if(stock_price_datas.length < i+check_i) check_i=stock_price_datas.length-i;
    for(var j=i;j<i+check_i;j++){
      console.log(i,j);
      pre5.push(stock_price_datas[j]['pre']);
    }
    cell.innerHTML = pre5.join();

    console.log(i, stock_price_datas[i]);
    judge.push(0); //zero
  }else if(fluctua>0){
    judge.push(+1); //+
  }else{
    judge.push(-1); //-
  }
  fluctua_values.push(fluctua);
  s.push([centerA, centerB]);
}

datas['judges'] = judge;
datas['fluctuas'] = fluctua_values;
datas['s'] = s;


// d3jsでのsvg描画
var size = {w: $(".view_stock_prices_zero").width(), h: $(".view_stock_prices_zero").width()/200}

var svg = d3.select(".view_stock_prices_zero").append("svg");
svg.attr("width", size.w);
svg.attr("height", size.h*3);

var update = svg.selectAll("rect").data(datas['judges']);
var enter = update.enter();
var exit = update.exit();

update.append("rect")
  .attr("x", function(d, i){return i*size.h})
  .attr("y", function(d, i){return size.h+(d*size.h)})
  .attr("width", size.h)
  .attr("height", size.h);
enter.append("rect")
  .attr("x", function(d, i){return i*size.h})
  .attr("y", function(d, i){return size.h+(d*size.h)})
  .attr("width", size.h)
  .attr("height", size.h)
  .style("stroke", function(b, i){return b==0?'red':'black'})
  .append('text')
  .style("stroke", "white")
  .text(function(d,i){return i});
exit.remove();


/*
* 投資指標データ解析パターン
*/
var match_data = datas['judges'].join(""); //比較対象
match_data=match_data.replace(/-1/g,"A");
match_data=match_data.replace(/1/g,"B");
match_data=match_data.replace(/0/g,"C");

for(var index in match_data){
  for(var str_num=3;str_num<match_data.length-index;str_num++){
    var check_text = match_data.slice(index, index+str_num); //一致確認文字

    //console.log(check_text, index, str_num);

    var match = match_data.slice(index+str_num, match_data.length).indexOf(check_text);
    if(match != -1){
      console.log(match, check_text, match_data.slice(index+str_num, index+(str_num+5)), match_data.slice(match+str_num*2, match+str_num*2+5));
    }
  }
}

// for(var index in datas['judges']){
//   for(var str_num=3;str_num<datas['judges'].length;str_num++){
//     var check_text = datas['judges'].split(index, str_num); //一致確認文字
//
//     if(match_data.indexOf(check_text.join("") != -1){
//
//     }
//   }
// }
