
/*
* 投資指標詳細の終値の折れ線グラフ
* d3js
* https://bl.ocks.org/pstuffa/26363646c478b2028d36e7274cedefa6
*/

var stock_price_datas = JSON.parse( document.getElementById("stock_price_datas").innerText);
var max_value = 0;
var min_value = 999999999999;
var final_prices = stock_price_datas.map(arr=>{
  if(max_value<arr['pre_close_price']) max_value=arr['pre_close_price'];
  if(min_value>arr['pre_close_price']) min_value=arr['pre_close_price'];
  return {'y': arr['pre_close_price']};
});


// 2. Use the margin convention practice
var margin = {top: 50, right: 10, bottom: 50, left: 50}
  , width = $(".view_stock_prices").width() - margin.left - margin.right // Use the window's width
  , height = 480 - margin.top - margin.bottom; // Use the window's height

// The number of datapoints
var n = final_prices.length;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, n-1]) // input
    .range([0, width]); // output

// 6. Y scale will use the randomly generate number
var yScale = d3.scaleLinear()
    .domain([min_value, max_value]) // input
    .range([height, 0]); // output

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })

console.log(dataset);
// 1. Add the SVG to the page and employ #2
var svg = d3.select(".view_stock_prices").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
svg.append("path")
    .datum(final_prices) // 10. Binds data to the line
    .attr("class", "line") // Assign a class for styling
    .attr("d", line); // 11. Calls the line generator

// 12. Appends a circle for each datapoint
svg.selectAll(".dot")
    .data(final_prices)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5);
