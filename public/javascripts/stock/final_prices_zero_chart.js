
/*
* 投資指標データ解析
*/

// 計算類
var final_prices_zero = stock_price_datas.map(function(arr){return arr['pre_close_price']});
var getCenter = function(a,b){return (a+b)/2;};
var fpz=final_prices_zero, pInt=parseInt, fluctua_sum=0;
for(var i=0;i<fpz.length-2;i++){
  fluctua_sum += pInt(fpz[i+1])-getCenter(pInt(fpz[i+0]), pInt(fpz[i+2]));
}

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
  if(Math.abs(fluctua) < fluctua_sum/4 || parseInt(fluctua)==0){
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







/**/
