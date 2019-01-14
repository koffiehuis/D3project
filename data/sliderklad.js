// var catOption = d3.select("select")
// catOption.attr("value", function() {
//
// })
// console.log(catOption.value)


// var sliderValue = d3.select("#slider")
//
// console.log(sliderValue)
// sliderValue.on("change", function(sliderValue) {
//   console.log(sliderValue.value)
// })
  // .style("background", "black")

  // .append("ouput")
  // .attr("id", `${mySlider_value}`)
  // console.log(mySlider_value)

  // .style("height", "100px")
  // .style("background", "blue")


// // SLIDER3 WEEEEH
// var sliderP = svgMap.append("p")
//   // .attr("transform", `translate(${window.innerWidth * 0.05} ${window.innerHeight * 0.05})`)
//   .style("position", "absolute")
//   .style("left", "8%")
//   .style("top", "200px")
//   .append("label")
//   .attr("for", "nRadius")
//   // .attr("style", "")
//   .text("text: ")
//   .append("span")
//   .attr("id", "nRadius-value")
//
// var sliderInput = d3.select("p").append("input")
//   .attr("type", "range")
//   .attr("min", "1995")
//   .attr("max", "2018")
//   .attr("id", "nRadius")
//   // .style("border-color", "black")
//   // .style("background", "black")


// SLIDER2 D3-SIMPLE SLIDER
// SOURCE: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

// var sliderDiv = d3.selectAll("svg").append("div").attr("row-align-items-center")
// sliderDiv.append("div").attr("class", "col-sm-2").append("p").attr("id", "value-time")
// sliderDiv.append("div").attr("class", "col-sm").append("div").attr("id", "slider-time")
//
// var dataTime = d3.range(0, 10).map(function(d) {
//    return new Date(1995 + d, 10, 3);
//  });
//
//  var sliderTime = d3
//    .sliderBottom()
//    .min(d3.min(dataTime))
//    .max(d3.max(dataTime))
//    .step(1000 * 60 * 60 * 24 * 365)
//    .width(300)
//    .tickFormat(d3.timeFormat('%Y'))
//    .tickValues(dataTime)
//    .default(new Date(1998, 10, 3))
//    .on('onchange', val => {
//      d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
//    });
//
//  var gTime = d3
//    .select('div#slider-time')
//    .append('svg')
//    .attr('width', 500)
//    .attr('height', 100)
//    .append('g')
//    .attr('transform', 'translate(30,30)');
//
//  gTime.call(sliderTime);
//
//  d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
