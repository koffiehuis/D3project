const fileName = "json.json"
const data = [];
var categoryOption = "Combustion";
var yearOption = "2010";
var countryOption = "DEU";


window.onload = function() {


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
  // console.log(filterData("line1"))
  // makeMapChart()



  }).catch(function(e){
      throw(e);
  });
};


function initializeChartContainers() {
  let svgWidth = "40%";
  let svgHeight = "350";
  // var paddingLeft
  var svgMap = d3.select("body")
    .append("svg")
    .attr("id", "choroplethSVG")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .attr("class", "map")
    .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)

  // var projection = d3.geoMercator()
  //                    .scale(130)
  //                    .translate([0, 0])
  // var path = d3.geoPath().projection(projection);
  //
  // svgMap.append("g")
  //       .attr("class", "countries")
  //     .selectAll("path")
  //     .data({
  //             USA: {fillKey: "a"},
  //             NLD: {fillKey: "b"},
  //           })
  //
  //
  // svgMap.append("path")
  // // svgMap.call(tip)
    // .attr("id", "choroplethMap")


  var dataPie = filterData("pie");
  console.log(filterData("pie"));
  var widthPie = window.innerWidth * 0.4,
  // var widthPie = 350,
      heightPie = 350,
      radius = Math.min(widthPie, heightPie) / 3;


  colorSheme = ["#1f77b4",  "#ff7f0e", "#17becf", "#8c564b", "black", "#7f7f7f", "#d62728"]
  colorDomain = ["Hydro", "Solar", "Wind", "Combustion", "Nuclear", "Other", "Geothermal"]
  var color = d3.scaleOrdinal(colorSheme)
    // .range(["blue", "green", "yellow"])
    .domain(colorDomain)

  // var color = d3.scaleOrdinal(d3[data[0]])

  // ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
  // ["Hydro", "Solar", "Wind", "Combustion", "Nuclear", "Other", "Geothermal"]
  // ["#1f77b4",  "#ff7f0e", "#17becf", "#8c564b", "black", "#7f7f7f", "#d62728"]

  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var labelArc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 10);


// Source: https://stackoverflow.com/questions/14534024/preventing-overlap-of-text-in-d3-pie-chart
var getAngle = function (d) {
  return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
}

  var pie = d3.pie()
    .sort(null)
    . value(function(d) { return parseInt(d.Quantity); });


  var svgPie = d3.select("body")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    // .attr("class", "pie")
    .append("g")
    .attr("transform", `translate(${window.innerWidth * 0.25} 100)`)

    var g = svgPie.selectAll(".arc")
       .data(pie(dataPie))
     .enter().append("g")
       .attr("class", "arc");

   g.append("path")
       .attr("d", arc)
       .style("fill", function(d) {
         return color(d.data.categoryTag); });


   g.append("text")
       .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")" + "rotate(" + getAngle(d) + ")"; })
       // .attr("dx", ".35em")
       .attr("dy", ".35em")
       .text(function(d) {
         if (parseInt(d.data.Quantity) > 200){
           return d.data.categoryTag;
         }
          else {
            return " ";
          }
       })
       // .text("function(d) { return d.categoryTag; }")
       .style("fill", "#565656")
       .style("font-weight", "bold");

  // console.log(dataPie[0].Quantity)
  // console.log(labelArc.centroid((parseInt(dataPie[0].Quantity))))

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

// SLIDER1 INPUT TAG

  var sliderP = d3.select("body").append("p").attr("class", "mand").style("position", "absolute").style("top", "200px").style("right", `${window.innerWidth * 0.1}`)
  var slider = sliderP.append("input")
    .attr("class", "slider")
    .attr("type", "range")
    .attr("id", "mySlider")
    .attr("min", "1995")
    .attr("max", "2015")
    .on("change", function(d) {
      showSliderValue(mySlider.value)
      //updatePie()
      return mySlider.value
    })

  var label = d3.select(".mand").append("label").style("position", "absolute").style("top", "3px")

    // .attr("transform", `translate(${window.innerWidth * 0.05} ${window.innerHeight * 0.05})`)
    // .style("-webkit-appearance", "none")
    .style("position", "absolute")
    // .style("top", "200px")
    // .style("left", "8%")

  function showSliderValue(value) {
    label.text(`${value}`)
    yearOption = value;
    console.log(yearOption)
  }

  function categoryOptions () {
    for (var i = 0; i < 7; i++) {
      d3.select("select")
        .append("option")
        .attr("class", "option1")
    }


    d3.selectAll("option")
      .data(["Choose worldmap category", "Hydro", "Solar", "Wind", "Combustion", "Nuclear", "Other", "Geothermal"])
      .attr("value", function(d) {
        return d;
      })
      .text(function(d) {
        return d;
      })
  }

  d3.selectAll("select").on("change", function() {
    var selected = document.getElementById("mySelect")
    categoryOption = selected.options[selected.selectedIndex].value
    console.log(categoryOption)
  })


  categoryOptions()

};

function filterData(spec) {
  var allData = data[0]
  if (spec == "worldmap") {
    var groupCategory = _.groupBy(allData, obj => obj.categoryTag);
    groupCategory = _.groupBy(groupCategory[categoryOption], obj => obj.Year);
    return groupCategory[yearOption]
  }

  else if (spec == "pie") {
    var groupISO = _.groupBy(allData, obj => obj.ISO);
    groupISO = _.groupBy(groupISO[countryOption], obj => obj.Year);
    return groupISO[yearOption]
  }

  else if (spec == "line1") {
    var groupCountry = _.groupBy(allData, obj => obj.ISO);
    var groupYear = _.groupBy(groupCountry[countryOption], obj => obj.Year);

    var yearDict = {};
    for (var year of Object.values(groupYear)) {
      var categoryDict = {}
      var groupCategory =  _.groupBy(year, obj => obj.categoryTag);
      for (var category of Object.values(groupCategory)) {
        for (var country of Object.values(category)) {
          if (!isNaN(categoryDict[country.categoryTag])) {
            categoryDict[country.categoryTag] = parseInt(categoryDict[country.categoryTag]) + parseInt(country.Quantity)
          }
          else {
            categoryDict[country.categoryTag] = parseInt(country.Quantity)
          }
        }
      }
      yearDict[year[0].Year] = categoryDict
    }
    return yearDict
  }

  else if (spec == "line2") {
    var groupCategory = _.groupBy(allData, obj => obj.categoryTag);
    var groupYear = _.groupBy(groupCategory[categoryOption], obj => obj.Year);

    var yearDict = {};
    for (var year of Object.values(groupYear)) {
      var regionDict = {}
      var groupRegion =  _.groupBy(year, obj => obj.Region);
      for (var region of Object.values(groupRegion)) {
        for (var country of Object.values(region)) {
          if (!isNaN(regionDict[country.Region])) {
            regionDict[country.Region] = parseInt(regionDict[country.Region]) + parseInt(country.Quantity)
          }
          else {
            regionDict[country.Region] = parseInt(country.Quantity)
          }
        }
      }
      yearDict[year[0].Year] = regionDict
    }
    return yearDict
  }
}


// function makeMapChart() {
//   // d3.select(".map").append("rect").attr("width", "100").attr("height", "100")
//
//     var mapDiv = document.getElementById("manddiv")
//     console.log(mapDiv)
//
//     var worldmap = new Datamap({
//       element: document.getElementById("manddiv"),
//       projection: "mercator",
//       fills: {
//         a: "black",
//         b: "blue",
//       },
//       data: {
//         USA: {fillKey: "a"},
//         NLD: {fillKey: "b"},
//       }
//     })
// }
