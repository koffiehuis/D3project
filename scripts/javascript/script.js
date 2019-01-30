// Mark van Malestein
// D3-project
// 10807640
// group K

// Main script


// Initialize global variables
const fileName = "data/json.json"
const data = [];

var categoryOption = "Combustion";
var yearOption = "2000";
var countryOption = "DEU";
var countryName = "Germany";

var svgWidth = document.getElementById("mapDiv").offsetWidth;
const svgHeight = "350";

const blues = colorbrewer.Blues[9]

// Load JSON with preprocessed data and initialize all elements
window.onload = function() {
  var dataArray = [];

  // Fetch data and push to array
  fetch(fileName)
    .then((response) => response.json())
    .then((rawData) => {
      for (index in rawData) {
        dataArray[index] = rawData[index]
      }
      data.push(dataArray);

  // Convert numberical values from string to int/float
  convert();

  // Add titles
  initializeTitles()
  addTitles()

  // Initialize chart containers
  initializeMapContainer()
  initializePieContainer()
  initializeLine1Container()
  initializeLine2Container()

  // Initialize year-slider
  initializeSlider()

  // Deal with errors
  }).catch(function(e){
      throw(e);
  });
};

// Make chart size dependable on window size
window.onresize = function() {
  svgWidth = document.getElementById("mapDiv").offsetWidth;
  initializeMapContainer()
  initializePieContainer()
  initializeLine1Container()
  initializeLine2Container()
}

// Initializes worldmap
function initializeMapContainer() {

  // Remove previous worldmap-svg
  d3.select(".svgMap").remove();

  var width = svgWidth,
  height = "350";

  // Path for countries on worldmap
  var path = d3.geoPath();

  // Make svg
  var svgMap = d3.select("#mapDiv").append("svg")
      .attr("width", width + 30)
      .attr("height", height)
      .attr("class", "svgMap")
      .attr("id", "svgMap")
      .append("g")
      .attr("class", "gMap")

  // Load worldmap data, then make worlddmap
  var topojson = Promise.resolve(d3.json("data/world_countries.json"));
  topojson.then(function(value) {

    var projection = d3.geoMercator()
                       .scale(100)
                       .translate( [width / 2.2, height / 1.5]);

    var path = d3.geoPath().projection(projection);

    // Add countries to worldmap
    svgMap.append("g").attr("class", "countries")
      .selectAll("path")
      .data(value.features)
    .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "countryPath")
      .style("stroke", "#7F7F7F")

      // If a country is clicked reload piechart and linechart 1
      .on("click", function(d) {

        // Give user alers if country with no data is selected
        if (d3.select(this).style("fill") == "rgb(0, 0, 0)") {
          alert(`No data for ${categoryOption} as a source for energy in ${d.properties.name}`)
        }

        // Change global settings
        countryOption = d.id;
        countryName = d.properties.name;

        // Reload relevant elements
        loadDataPie();
        loadDataLine1();
        addTitles();
      })

    // Load electricity-data to map
    loadDataMap();
})
}

// Loads data to worldmap
function loadDataMap() {

  // Remove old legend
  d3.select(".mapLegend").remove();

  // Get all relevant values for each country
  var dataMap = filterData("worldmap")

  valueArray = [];
  for (var elem of Object.values(dataMap)) {
    valueArray.push(elem)
  }



  var toolTip = d3.tip()
    .attr("class", "toolTip")
    .offset([-10, 0])
    .html(function(d) {
      return "<span class='toolInfo'>" + d.properties.name + "<br/>" + dataMap[d.id]  + " GWh " + "</span>";
    })


  d3.select(".svgMap").call(toolTip)



  var quantize = d3.scaleQuantize()
      .domain([0, Math.max.apply(Math, valueArray)])
  		.range(blues);

  d3.selectAll(".countryPath")
  .style("fill", function(d) {
    if (!isNaN(dataMap[d.id])) {
      return quantize(dataMap[d.id])
    }
  })



  d3.selectAll(".countryPath").on("mouseover", function(d) {
    toolTip.show(d)
      .style("left", `${d3.event.pageX}px`)
      .style("top", `${d3.event.pageY - 50}px`)

    d3.select(this)
      .style("stroke", "black")
  })
  .on("mouseout", function() {
    toolTip.hide()

    d3.select(this)
      .style("stroke", "#7F7F7F")
  })


  var legendQuantize = d3.legendColor()
  	.classPrefix("colorLegend")
    .labelFormat(d3.format(".2s"))
  	.shape("rect")
    .scale(quantize);

  d3.select(".gMap").append("g").attr("class", "mapLegend").call(legendQuantize)
    .attr("transform", `translate(${svgWidth - 75} 190)`)




}


function initializePieContainer() {
  d3.select(".svgPie").remove();
  var dataPie = filterData("pie");
  var widthPie = svgWidth,
      heightPie = 350,
      radius = Math.min(widthPie, heightPie) / 3;



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


  var svgPie = d3.select("#pieDiv")
    .append("svg")
    .attr("class", "svgPie")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)

   loadDataPie()
}


function loadDataPie() {
  var widthPie = svgWidth,
      heightPie = 350,
      radius = Math.min(widthPie, heightPie) / 3 + 10;

  var valueArray = [];
  var valueSum = 0;
  for (value of Object.values(filterData("pie"))) {
    valueArray.push(value.Quantity)
    valueSum += value.Quantity
  }


  var maxValue = Math.max.apply(Math, valueArray)

  var toolTip = d3.tip()
    .attr("class", "toolTip")
    .offset([-10, 0])
    .html(function(d) {
      return "<span class='toolInfo'>" + d.data.categoryTag + "<br/>" + d.data.Quantity  + " GWh" + "</span>";
    })


  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var labelArc = d3.arc()
    .outerRadius(radius - 5)
    .innerRadius(radius - 5);

  var hoverArc = d3.arc().outerRadius(radius + 20)

  var pie = d3.pie()
    .sort(null)
    . value(function(d) { return parseInt(d.Quantity); });

  pieData = pie(filterData("pie"));

  var getAngle = function (d) {
      return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
  }

  d3.selectAll('.svgPie').call(toolTip)
  d3.selectAll(".arc").remove()

  var g = d3.select(".svgPie").selectAll(".arc")
     .data(pieData)
   .enter().append("g")
     .attr("class", "arc")
     .attr("transform", "translate(" + svgWidth / 2 + " " + svgHeight / 2 + ")");

  d3.selectAll(".piePath").remove()

  g.append("path")
    .attr("class", "piePath")
     .attr("d", arc)
     .style("fill", function(d) {
       return colorFunction(maxValue, d.data.Quantity); })
        .transition()
        .duration(500)
        .attrTween('d', function(d) {
    		var interPol = d3.interpolate(d.startAngle, d.endAngle);
    		return function(t) {
    			d.endAngle = interPol(t);
    			return arc(d)
    			}
    		});

      d3.selectAll(".piePath").style("stroke-width", ".5px")
       .style("stroke", "black")
     .on("click", function(d) {
       categoryOption = d.data.categoryTag;
       document.getElementById("mySelect").value = categoryOption
       loadDataMap();
       loadDataLine2();
       addTitles();
     })
     .on("mouseover", function(d) {
       toolTip.show(d)
         .style("left", `${d3.event.pageX}px`)
         .style("top", `${d3.event.pageY - 50}px`)

       d3.select(this)
         .style("stroke", "black")
         .style("stroke-width", "2px")
     })
     .on("mouseout", function() {
       toolTip.hide()

       d3.select(this)
         .style("stroke", "black")
         .style("stroke-width", ".5px")
     })


  g.append("text")
     .style("text-anchor", "end")
     .attr("transform", function(d) {
       centroid = labelArc.centroid(d)
       if (centroid[0] < 0.0) {
         return "translate(" + centroid + ")" + "rotate(" + (getAngle(d) + 180) + ")";

       }
       else {
         d3.select(this).style("text-anchor", "start")
         return "translate(" + centroid + ")" + "rotate(" + getAngle(d) + ")";
       }
     })
     .attr("dy", ".35em")
     .attr("class", "pieText")
     .text(function(d) {
       if (parseInt(d.data.Quantity) > 0.005 * valueSum){
         return d.data.categoryTag;
       }
        else {
          return " ";
        }
     })
     .style("fill", "#565656")
     .style("font-weight", "bold");


}


function initializeLine1Container() {
  d3.select(".line1").remove();


  var dataLine1 = filterData("line1")

  var yValues = getValues(dataLine1, categoryOption);


  var maxY = Math.max.apply(Math, yValues);

  var margin = {top: 50, right: 50, left: 50, bottom: 50},
    widthLine1 = svgWidth - margin.left - margin.right,
    heightLine1 = 350 - margin.top - margin.bottom;


  var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine1 * .85]);


  var svgLine1 = d3.select("#line1Div")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .attr("class", "line1")
    .append("g")
    .attr("transform", `translate(${svgWidth * 0.15} 10)`)



  svgLine1.append("g").attr("class", "lines")


  var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("0"));


  svgLine1.append("g")
    .attr("class", "xAxis1")
    .attr("transform", `translate(0 ${heightLine1})`)
    .call(xAxis)
    .append("text")
    .attr("x", widthLine1 * .85 / 2)
    .attr("y", 30)
    .attr("fill", "#000")
    .text("Years");

  svgLine1.append("g")
    .attr("class", "yAxis1")
    .append("text")
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Million kWh");


  loadDataLine1();
  }


function loadDataLine1() {
  d3.selectAll(".line-group1").remove()

  var dataLine1 = filterData("line1")

  var yValues = getValues(dataLine1, categoryOption);


  var maxY = Math.max.apply(Math, yValues);


  var margin = {top: 50, right: 50, left: 50, bottom: 50},
    widthLine1 = svgWidth - margin.left - margin.right,
    heightLine1 = 350 - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y");

  var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine1 * .85]);

  var yScale = d3.scaleLinear().domain([0, maxY]).range([heightLine1, 0]);

  var line = d3.line()
  .x(d => xScale(d.Year))
  .y(d => yScale(d.Quantity));


  // From https://bl.ocks.org/mbostock/5649592
  function transition(path) {
    path.transition()
        .duration(750)
        .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
        var l = this.getTotalLength(),
          i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) {
          return i(t); };
    }



  var lines = d3.select(".lines")
  lines.selectAll(".line-group1")
    .data(dataLine1).enter()
    .append('g')
      .attr('class', 'line-group1')

    .append('path')
    .attr('class', 'lineLine1')

  var toolTip = d3.tip()
    .attr("class", "toolTip")
    .offset([-10, 0])
    .html(function(d) {
      return "<span class='toolInfo'>" + d.categoryTag + "<br/>" + d.Year + ": " + d.Quantity  + " GWh " + "</span>";
    })

  var toolTipLine = d3.tip()
    .attr("class", "toolTip")
    .offset([-10, 0])
    .html(function(d) {
      return "<span class='toolInfo'>" + d + "</span>";
    })

    d3.select(".line1").call(toolTip)
    d3.select(".line1").call(toolTipLine)

  var maxValue = getHighestValue(dataLine1)

console.log(dataLine1)
  d3.selectAll(".lineLine1").data(dataLine1)
    .attr('d', d => line(d.values))
    .call(transition)

    .style('stroke', function(d) {
      return colorFunction(maxValue, getMeanValue(d.values))
    })
    .style("stroke-width", "3px")
    .style("fill", "transparent")
    .on("mouseover", function(d){
      toolTipLine.show(d.categoryTag)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 50}px`)
      d3.select(this)
        .style("stroke", "#74ffb0")
        .style("stroke-width", "4px")
    })
    .on("mouseout", function() {
      toolTipLine.hide()
      d3.select(this)
        .style("stroke", function(d) {
          return colorFunction(maxValue, getMeanValue(d.values))
        })
        .style("stroke-width", "4px")
    })

  d3.selectAll(".circle").remove()

  var parentColor = null;
  d3.selectAll(".line-group1").selectAll(".circle")
    .data(function(d) { return d.values })
    .enter()
    .append("circle")
      .attr("class", "circle")
      .attr("r",3)
      .attr("cx", function(d) {
        return xScale(d.Year) })
      .attr("cy", function(d) {
        return yScale(d.Quantity) })
      .attr("fill", function(d) {
        return d3.select(this.parentNode).select(".lineLine1").style("stroke")
      })
      .on("mouseover", function(d) {
        toolTip.show(d)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 50}px`)
        parentColor = d3.select(this.parentNode).select(".lineLine1").style("stroke")

        d3.select(this.parentNode).select(".lineLine1").style("stroke", "#74ffb0")

      })
      .on("mouseout", function(d) {
        toolTip.hide()
        d3.select(this.parentNode).select(".lineLine1").style("stroke", parentColor)
      })

  var yAxis = d3.axisLeft(yScale).ticks(5);

  d3.select(".yAxis1").call(yAxis)
  }


function initializeLine2Container() {
    d3.selectAll(".line2").remove();

    var dataLine2 = filterData("line2")

    var yValues = getValues(dataLine2, categoryOption);


    var maxY = Math.max.apply(Math, yValues);

    var margin = {top: 50, right: 50, left: 50, bottom: 50},
      widthLine2 = svgWidth - margin.left - margin.right,
      heightLine2 = 350 - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%Y");

    var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine2 * .85]);

    var yScale = d3.scaleLinear().domain([0, maxY]).range([heightLine2, 0]);

    var line2 = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Quantity));



    var svgLine2 = d3.select("#line2Div")
      .append("svg")
      .attr("width", `${svgWidth}`)
      .attr("height", `${svgHeight}`)
      .attr("class", "line2")
      .append("g")
      .attr("transform", `translate(${svgWidth * 0.15} 10)`)





    var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("0"));

    var yAxis = d3.axisLeft(yScale).ticks(5);


    svgLine2.append("g")
      .attr("class", "xAxis2")
      .attr("transform", `translate(0 ${heightLine2})`)
      .call(xAxis)
      .append("text")
      .attr("x", widthLine2 * .85 / 2)
      .attr("y", 30)
      .attr("fill", "#000")
      .text("Years");

    svgLine2.append("g")
      .attr("class", "yAxis2")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Million kWh");

      loadDataLine2();
}


function loadDataLine2() {

  d3.selectAll(".line-group2").remove();

  var margin = {top: 50, right: 50, left: 50, bottom: 50},
    widthLine2 = svgWidth - margin.left - margin.right,
    heightLine2 = 350 - margin.top - margin.bottom;

  var dataLine2 = filterData("line2");

  var yValues = getValues(dataLine2, categoryOption);


  var maxY = Math.max.apply(Math, yValues);

  var parseTime = d3.timeParse("%Y");

  var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine2 * 0.85]);

  var yScale = d3.scaleLinear().domain([0, maxY]).range([heightLine2, 0]);

  var line2 = d3.line()
  .x(d => xScale(d.Year))
  .y(d => yScale(d.Quantity));

  var yAxis = d3.axisLeft(yScale).ticks(5);

  function transition(path) {
    path.transition()
        .duration(750)
        .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
        var l = this.getTotalLength(),
          i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) {
          return i(t); };
    }

  var lines = d3.select(".line2").append("g").attr("class", "lines")
  lines.selectAll(".line-group2")
    .data(dataLine2).enter()
    .append('g')
      .attr('class', 'line-group2')
      .attr("transform", `translate(${svgWidth * 0.15} 10)`)


    .append('path')
    .attr('class', 'PathLine2')
    .attr('d', d => line2(d.values))
    .call(transition)

    .style('stroke', "black")
    .style("stroke-width", "3px")
    .style("fill", "transparent")


   function getHighestValue(data) {
     bigValuesList = []
     for (cat of data) {
       smallValuesList = [];
       for (value of cat.values) {
         smallValuesList.push(value.Quantity)
       }
       bigValuesList.push(d3.mean(smallValuesList))
     }
     return Math.max.apply(Math, bigValuesList)
   }

   function getMeanValue(values) {
     smallValuesList = [];
     for (value of Object.values(values.values)) {
       smallValuesList.push(value.Quantity)
     }
     return d3.mean(smallValuesList)
   }

  var maxValue = getHighestValue(dataLine2)

  var toolTipDot = d3.tip()
    .attr("class", "toolTip")
    .offset([-10, 0])
    .html(function(d) {
      return "<span class='toolInfo'>" + d.Region + "<br/>" + d.Year + ": " + Math.round(d.Quantity) + " GWh "+ "</span>";
    })

  var toolTipLine = d3.tip()
    .attr("class", "toolTip")
    .offset([-10, 0])
    .html(function(d) {
      return "<span class='toolInfo'>" + d.Region + "</span>";
    })

    d3.select(".line2").call(toolTipDot)
    d3.select(".line2").call(toolTipLine)

  d3.selectAll(".PathLine2").data(dataLine2).attr('d', d => line2(d.values))
    .style("stroke", function (d, i) { return colorFunction(maxValue, getMeanValue(d)) } )

  d3.select(".yAxis2").call(yAxis)

  d3.selectAll(".PathLine2")
    .on("mouseover", function(d){
      toolTipLine.show(d)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 50}px`)
      d3.select(this)
        .style("stroke", "#74ffb0")
        .style("stroke-width", "4px")
    })
    .on("mouseout", function() {
      toolTipLine.hide()
      d3.select(this)
        .style("stroke", function(d) {
          return colorFunction(maxValue, getMeanValue(d))
        })
        .style("stroke-width", "4px")
    })


    d3.selectAll(".circle2").remove()

  var parentColor = null;
  d3.selectAll(".line-group2").selectAll(".circle2")
    .data(function(d) { return d.values })
    .enter()
    .append("circle")
      .attr("class", "circle2")
      .attr("r",3)
      .attr("cx", function(d) {
        return xScale(d.Year) })
      .attr("cy", function(d) {
        return yScale(d.Quantity) })
      .attr("fill", function(d) {
        return d3.select(this.parentNode).select(".PathLine2").style("stroke")
      })
      .on("mouseover", function(d) {
        toolTipDot.show(d)
        .style("left", `${d3.event.pageX}px`)
        .style("top", `${d3.event.pageY - 50}px`)
        parentColor = d3.select(this.parentNode).select(".PathLine2").style("stroke")

        d3.select(this.parentNode).select(".PathLine2").style("stroke", "#74ffb0")

      })
      .on("mouseout", function(d) {
        toolTipDot.hide()
        d3.select(this.parentNode).select(".PathLine2").style("stroke", parentColor)
      })
}


function initializeSlider() {
  var sliderP = d3.select("#mapDiv").append("p").attr("class", "sliderP")
  .style("position", "absolute")
  .style("top", "25px")

  var slider = sliderP.append("input")
    .attr("class", "slider")
    .attr("type", "range")
    .attr("id", "mySlider")
    .attr("min", "1995")
    .attr("max", "2014")

    document.getElementById("mySlider").defaultValue = 2000;

    slider.on("change", function(d) {
      showSliderValue(mySlider.value)
      yearOption = mySlider.value;
      loadDataMap()
      loadDataPie();
      addTitles();
      return mySlider.value
    })

  var label = d3.select(".sliderP").append("label")
    .style("position", "absolute")
    .style("top", "2.5px")
    .style("left", "135px")
    .style("background", "white")
    .attr("rx", 10)


  showSliderValue(mySlider.value)

  function showSliderValue(value) {
    label.text(`${value}`)

    yearOption = value;
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
    loadDataMap();
    loadDataPie();
    loadDataLine2();
    addTitles();
  })


  categoryOptions()

};


function filterData(spec) {
  var allData = data[0]
  if (spec == "worldmap") {
    regionDict = {};
    var groupCategory = _.groupBy(allData, obj => obj.categoryTag);
    groupYear = _.groupBy(groupCategory[categoryOption], obj => obj.Year);
    groupRegion = _.groupBy(groupYear[yearOption], obj => obj.ISO);
    for (var region of Object.values(groupRegion)) {
      regionDict[region[0].ISO] =  region[0].Quantity;
    }
    return regionDict;
  }

  else if (spec == "pie") {
    var groupISO = _.groupBy(allData, obj => obj.ISO);
    groupISO = _.groupBy(groupISO[countryOption], obj => obj.Year);
    return groupISO[yearOption]
  }

  else if  (spec == "line1") {
    var groupCountry = _.groupBy(allData, obj => obj.ISO);
    var groupCategory = _.groupBy(groupCountry[countryOption], obj => obj.categoryTag);
    array = [];
    for (var index in Object.values(groupCategory)) {
      sorted = Object.values(groupCategory)[index].sort((a, b) => (a.Year > b.Year) ? 1 : -1)
      array.push({"categoryTag": Object.keys(groupCategory)[index], "values": sorted})
    }
    return array;
  }

  else if (spec == "line2") {
    var groupCategory = _.groupBy(allData, obj => obj.categoryTag);
    totalArray = [];
    var groupRegion =  _.groupBy(groupCategory[categoryOption], obj => obj.Region);
    for (var index in Object.values(groupRegion)) {
      regionArray = [];
      key = Object.keys(groupRegion)[index]
      value = Object.values(groupRegion)[index]
      var groupYear =  _.groupBy(value, obj => obj.Year);
      for (var yearIndex in groupYear) {
        sum = 0;
        for (var elem of groupYear[yearIndex]) {
          sum += elem.Quantity
        }
        regionArray.push({"Year": parseInt(yearIndex), "Quantity": sum, "Region": elem.Region})
      }
      if (Object.keys(groupRegion)[index] != "null") {
        totalArray.push({"Region": Object.keys(groupRegion)[index], "values": regionArray})
      }
    }
    return totalArray;
  }
}


function colorFunction(maxValue, d) {
  // from: https://blockbuilder.org/SpaceActuary/69e7f74035787955bcf9
  var color = d3.scaleQuantize()
      .domain([0, maxValue])
      .range(blues);

  return color(d);
}


function getValues(data, option) {
  valueList = [];
  for (var cat of Object.values(data)) {
    for (var object of Object.values(cat.values)) {
      valueList.push(object.Quantity)
    }
  }
  return valueList;
}


function convert() {
  newData = [];
  for (var index in Object.values(data)[0]) {
    elem = Object.values(data)[0][index];
    elem.Year = parseInt(elem.Year);
    elem.Quantity = parseFloat(elem.Quantity);
  }
}


function getHighestValue(data) {
  bigValuesList = []
  for (cat of data) {
    smallValuesList = [];
    for (value of cat.values) {
      smallValuesList.push(value.Quantity)
    }
    bigValuesList.push(d3.mean(smallValuesList))
  }
  return Math.max.apply(Math, bigValuesList)
}


function getMeanValue(values) {
  smallValuesList = [];
  for (value of values) {
    smallValuesList.push(value.Quantity)
  }
  return d3.mean(smallValuesList)
}


function initializeTitles() {
  d3.select("#mapDiv")
  .append("div")
  .attr("class", "mapTextDiv")

  d3.select("#pieDiv")
  .append("div")
  .attr("class", "pieTextDiv")

  d3.select("#line1Div")
  .append("div")
  .attr("class", "line1TextDiv")

  d3.select("#line2Div")
  .append("div")
  .attr("class", "line2TextDiv")
}


function addTitles() {
  d3.select(".mapTextDiv")
  .text(`Map Chart Showing ${categoryOption} per Country in ${yearOption}`).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "mapText")

  d3.select(".pieTextDiv")
  .text(`Pie Chart Showing Different Categories for ${countryName} in ${yearOption}`).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "pieText")

  d3.select(".line1TextDiv")
  .text(`Line Graph Showing Different Categories for ${countryName} over Time`).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "line1Text")

  d3.select(".line2TextDiv")
  .text(`Line Graph Showing ${categoryOption} Values for Different Regions over Time`).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "line2Text")
}
