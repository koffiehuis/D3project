const fileName = "json.json"
const data = [];

window.onload = function() {

  var countryOption = "NLD";
  var categoryOption = "Combustion";

  var dataArray = [];
  fetch(fileName)
    .then((response) => response.json())
    .then((rawData) => {
      for (index in rawData) {
        dataArray[index] = rawData[index]
      }
      data.push(dataArray);

  // dataArray = processingfunctie(response);
  // processedData = dataArray;
  initializeChartContainers()
  mand()


  }).catch(function(e){
      throw(e);
  });
};

function mand () {
  console.log(data[0])
}

function initializeChartContainers() {
  console.log(window.innerWidth)
  let svgWidth = "40%";
  let svgHeight = "350";
  // var paddingLeft
  var svgMap = d3.select("body")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .attr("class", "map")
    .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)

  var svgPie = d3.select("body")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .attr("class", "pie")
    .attr("transform", `translate(${window.innerWidth * 0.15} 0)`)

  var svgLine1 = d3.select("body")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .attr("class", "line1")
    .attr("transform", `translate(${window.innerWidth * 0.05} ${window.innerHeight * 0.05})`)

  var svgLine2 = d3.select("body")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .attr("class", "line2")
    .attr("transform", `translate(${window.innerWidth * 0.15} ${window.innerHeight * 0.05})`)

  var slider = d3.select("body")
    .append("input")
    .attr("class", "slider")
    .attr("type", "range")
    .attr("min", "1995")
    .attr("max", "2015")
    .attr("max", "2005")
    // .attr("transform", `translate(${window.innerWidth * 0.05} ${window.innerHeight * 0.05})`)
    .style("position", "absolute")
    .style("top", "200px")
    .style("left", "8%")
    // .style("border-color", "black")
    // .style("background", "black")

};
