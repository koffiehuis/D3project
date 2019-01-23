const fileName = "json.json"
const data = [];
const data2 = [];

var categoryOption = "Combustion";
var yearOption = "2014";
var countryOption = "DEU";

var svgWidth = document.getElementById("mapDiv").offsetWidth;
var svgHeight = "350";

colorSheme = ["#1f77b4",  "#ff7f0e", "#17becf", "#8c564b", "black", "#7f7f7f", "#d62728"]
colorDomain = ["Hydro", "Solar", "Wind", "Combustion", "Nuclear", "Other", "Geothermal"]
var color = d3.scaleOrdinal(colorSheme)
  // .range(["blue", "green", "yellow"])
  .domain(colorDomain)

function color2(d) {
  i = colorDomain.indexOf(d)
  return colorSheme[i]
}

  // Delete duplicate code (initialize -> load) (line 2 en pie)
  // CHECK Clear all previous text etc (debuggen van piechart labels en lines legends) x
  // CHECK fix the worldmap
  // CHECK legends
  // Fix dat legend klopt met line colors x
  // CHECK colorscheme worldmap x
  // CHECK Tooltips x (1/2)
  // CHECK lines linecharts pretty  x
  // CHECK Click pie slice -> line2 x
  // CHECK Add titles to charts

  // preprocessing (maybe fix manually) zowel landen als alle categories checken
  // duplicates verwijderen tijdens preprocessing (china honkong etc)

  // CHECK bootstrap grid (voor smooth resizing / scaling)
  // header-comments en normale comments in ALLE files
  // Geen uitgecommente code!!! strafpunten!!
  // CHECK Show starting value of slider x

window.onload = function() {


  var dataArray = [];
  fetch(fileName)
    .then((response) => response.json())
    .then((rawData) => {
      for (index in rawData) {
        dataArray[index] = rawData[index]
      }
      data.push(dataArray);

  data2.push(convert())
  // dataArray = processingfunctie(response);
  // processedData = dataArray;
  initializeTitles()
  addTitles()
  initializeMapContainer()
  initializePieContainer()
  initializeLine1Container()
  initializeLine2Container()
  initializeSlider()


  // makeMapChart()



  }).catch(function(e){
      throw(e);
  });
};


window.onresize = function() {
  svgWidth = document.getElementById("mapDiv").offsetWidth;
  initializeMapContainer()
  initializePieContainer()
  initializeLine1Container()
  initializeLine2Container()
}


function initializeMapContainer() {
  d3.select(".svgMap").remove();
  var width = svgWidth,
  height = "350";
  // var width =

  var path = d3.geoPath();

  var svgMap = d3.select("#mapDiv").append("svg")
      .attr("width", width)
      .attr("height", height)
      // .attr("transform", `translate(${window.innerWidth * .05} 0)`)
      .attr("class", "svgMap")
      .attr("id", "svgMap")
      .append("g")
      .attr("class", "gMap")

  var topojson = Promise.resolve(d3.json("world_countries.json"));
  topojson.then(function(value) {

    var projection = d3.geoMercator()
                       .scale(100)
                       // .translate( [width / 2, height / 1.5]);
                       .translate( [width / 2.2, height / 1.5]);

    var path = d3.geoPath().projection(projection);


    svgMap.append("g").attr("class", "countries")
      .selectAll("path")
      .data(value.features)
    .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "hier")
      .on("click", function(d) {
        countryOption = d.id;
        loadDataPie();
        loadDataLine1();
        addTitles();
      })

    loadDataMap();
})
}


function loadDataMap() {
  valueArray = [];
  for (var elem of Object.values(filterData("worldmap"))) {
    valueArray.push(elem)
  }

  var dataMap = filterData("worldmap")

  // var div = d3.select("body").append("div")
  //     .attr("class", "tooltip")
  //     .style("opacity", 0);

  var toolTip = d3.tip()
    .attr("class", "toolTip")
    .offset([-10, 0])
    .html(function(d) {
      return "<span class='toolInfo'>" + d.id + "<br/>" + dataMap[d.id] + "</span>";
    })
    // .style("left", d3.select(this).attr("cx") + "px")
    // .style("top", d3.select(this).attr("cy") + "px");
  d3.select(".svgMap").call(toolTip)

  var colorMap = d3.scaleLinear()
    .domain([0, Math.max.apply(Math, valueArray)])
    .range(["white", "blue"]);
  // var colorMap = d3.scaleQuantize()
  //   .domain([0,600000])
  //   .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
  //   "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

  d3.selectAll(".hier").style("fill", function(d) {
    if (!isNaN(dataMap[d.id])) {
      return colorMap(dataMap[d.id])
    }
  })
  // TRANSITIONS
  .on("mouseover", function(d) {
    toolTip.show(d)
      .style("left", `${d3.event.pageX}px`)
      .style("top", `${d3.event.pageY - 50}px`)
  })
  .on("mouseout", function() {
    toolTip.hide()
  })




}


function initializePieContainer() {
  d3.select(".svgPie").remove();
  var dataPie = filterData("pie");
  var widthPie = svgWidth,
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


  var svgPie = d3.select("#pieDiv")
    .append("svg")
    .attr("class", "svgPie")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    // .attr("class", "pie")
    // .append("g")
    // .attr("transform", "translate(" + svgWidth / 2 + " " + svgHeight / 2 + ")");


   //  var g = svgPie.selectAll(".arc")
   //     .data(pie(dataPie))
   //   .enter().append("g")
   //     .attr("class", "arc");
   //
   // g.append("path")
   //    .attr("class", "piePath")
   //     .attr("d", arc)
   //     .style("fill", function(d) {
   //       return color(d.data.categoryTag); })
   //     .on("click", function(d) {
   //       categoryOption = d.data.categoryTag;
   //       loadDataLine2();
   //     })
   //
   //
   // g.append("text")
   //     .style("text-anchor", "end")
   //     .attr("transform", function(d) {
   //       centroid = labelArc.centroid(d)
   //       if (centroid[0] < 0.0) {
   //         return "translate(" + centroid + ")" + "rotate(" + (getAngle(d) + 180) + ")";
   //
   //       }
   //       else {
   //         d3.select(this).style("text-anchor", "start")
   //         return "translate(" + centroid + ")" + "rotate(" + getAngle(d) + ")";
   //       }
   //     })
   //     // .attr("dx", ".35em")
   //     .attr("dy", ".35em")
   //     .attr("class", "pieText")
   //     .text(function(d) {
   //       if (parseInt(d.data.Quantity) > 200){
   //         return d.data.categoryTag;
   //       }
   //        else {
   //          return " ";
   //        }
   //     })
   //     // .text("function(d) { return d.categoryTag; }")
   //     .style("fill", "#565656")
   //     .style("font-weight", "bold");
   loadDataPie()
}


function loadDataPie() {
  var widthPie = svgWidth,
  // var widthPie = 350,
      heightPie = 350,
      radius = Math.min(widthPie, heightPie) / 3;


  colorSheme = ["#1f77b4",  "#ff7f0e", "#17becf", "#8c564b", "black", "#7f7f7f", "#d62728"]
  colorDomain = ["Hydro", "Solar", "Wind", "Combustion", "Nuclear", "Other", "Geothermal"]
  var color = d3.scaleOrdinal(colorSheme)
    // .range(["blue", "green", "yellow"])
    .domain(colorDomain)

  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var labelArc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 10);

  var pie = d3.pie()
    .sort(null)
    . value(function(d) { return parseInt(d.Quantity); });

  pieData = pie(filterData("pie"));

  var getAngle = function (d) {
      return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
  }

  // TOOLTIP SHIZZLE MAAR EERST MAP MOOIMAKEN ZODAT JE STYLE KAN KOPIEREN
  // d3.selectAll(".piePath").on("mouseover", function(d) {
  // })

  d3.selectAll(".arc").remove()

  var g = d3.select(".svgPie").selectAll(".arc")
     .data(pieData)
   .enter().append("g")
     .attr("class", "arc")
     .attr("transform", "translate(" + svgWidth / 2 + " " + svgHeight / 2 + ")");



  g.append("path")
    .attr("class", "piePath")
     .attr("d", arc)
     .style("fill", function(d) {
       return color(d.data.categoryTag); })
     .on("click", function(d) {
       categoryOption = d.data.categoryTag;
       loadDataLine2();
       addTitles();
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
     // .attr("dx", ".35em")
     .attr("dy", ".35em")
     .attr("class", "pieText")
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


  // var g = d3.select(".arc")
  //
  // d3.selectAll(".piePath").data(pieData).attr("d", arc).style("fill", function(d) {
  //   return color(d.data.categoryTag)
  // })
  //
  //
  // d3.selectAll(".pieText").data(pieData)
  //     .style("text-anchor", "end")
  //     .attr("transform", function(d) {
  //       centroid = labelArc.centroid(d)
  //       if (centroid[0] < 0.0) {
  //         return "translate(" + centroid + ")" + "rotate(" + (getAngle(d) + 180) + ")";
  //
  //       }
  //       else {
  //         d3.select(this).style("text-anchor", "start")
  //         return "translate(" + centroid + ")" + "rotate(" + getAngle(d) + ")";
  //       }
  //     })
  //     // .attr("dx", ".35em")
  //     .attr("dy", ".35em")
  //     .text(function(d) {
  //       if (parseInt(d.data.Quantity) > 200){
  //         return d.data.categoryTag;
  //       }
  //        else {
  //          return " ";
  //        }
  //     })
  //     // .text("function(d) { return d.categoryTag; }")
  //     .style("fill", "#565656")
  //     .style("font-weight", "bold")
  //     // .style("text-anchor", "end")
  //     // .attr("transform", "rotate(180, 225, 225)")
  //

}


function initializeLine1Container() {
  d3.select(".line1").remove();


  var dataLine1 = filterData("line1")

  var yValues = getValues(dataLine1, categoryOption);


  var maxY = Math.max.apply(Math, yValues);

  var margin = {top: 50, right: 50, left: 50, bottom: 50},
    widthLine1 = svgWidth - margin.left - margin.right,
    heightLine1 = 350 - margin.top - margin.bottom;

  // var parseTime = d3.timeParse("%Y");

  var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine1 * .85]);

  // var yScale = d3.scaleLinear().domain([0, maxY]).range([heightLine1, 0]);


  // var line = d3.line()
  // .x(d => xScale(d.Year))
  // .y(d => yScale(d.Quantity));



  var svgLine1 = d3.select("#line1Div")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .attr("class", "line1")
    .append("g")
    .attr("transform", `translate(${svgWidth * 0.1} 0)`)



  svgLine1.append("g").attr("class", "lines")
  // lines.selectAll(".line-group")
  //   // .data(dataLine1).enter()
  //   .append('g')
  //     .attr('class', 'line-group')
  //
  //   .append('path')
  //   .attr('class', 'lineLine1')
    // .attr('d', d => line(d.values))
    //
    // .style('stroke', (d, i) => color(i))
    // .style("stroke-width", "3px")
    // .style("fill", "transparent")

  var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("0"));

  // var yAxis = d3.axisLeft(yScale).ticks(5);


  svgLine1.append("g")
    .attr("class", "xAxis1")
    .attr("transform", `translate(0 ${heightLine1})`)
    .call(xAxis);

  svgLine1.append("g")
    .attr("class", "yAxis1")
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("kWh");
  loadDataLine1();
  }


function loadDataLine1() {
  d3.select(".line-group").remove()

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
  //
  // d3.selectAll(".line-group").data(dataLine1).enter().
  var lines = d3.select(".lines")
  lines.selectAll(".line-group")
    .data(dataLine1).enter()
    .append('g')
      .attr('class', 'line-group')

    .append('path')
    .attr('class', 'lineLine1')



  d3.selectAll(".lineLine1").data(dataLine1)
    .attr('d', d => line(d.values))
    // .style('stroke', (d, i) => color(i))
    .style('stroke', function(d) {
      return color2(d.cat)
    })
    .style("stroke-width", "3px")
    .style("fill", "transparent")

  var yAxis = d3.axisLeft(yScale).ticks(5);

  d3.select(".yAxis1").call(yAxis)

  d3.selectAll(".colorRect").remove()
  d3.selectAll(".legend1").remove()

  var legend = d3.select(".line1").selectAll(".legend1")
    .data(dataLine1)
    .enter()
    .append("text")
    .attr("class", "legend1")
   .text(function(d) { return d.cat})
    .attr("x", 100)
    .attr("y", 9)
    .attr("dy", ".40em")
    .style("text-anchor", "start")
    .attr("transform", function(d, i) {
      return "translate(" + svgWidth * 0.73 + " " + i * 20 + ")";
    });

  var legendRects = d3.select(".line1").selectAll(".legend-rect")
    .append("rect")
    .attr("class", "legend-rect")
    .data(dataLine1)
    .enter()
    .append("rect")
      .attr("class", "colorRect")
      .attr("x", 20)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", function(d) {
        console.log(d)
        console.log(color2(d.cat));
        return color2(d.cat) })
      .attr("transform", function(d, i) {
        return "translate(" + svgWidth * 0.80 + " " + i * 20 + ")";
      });
  }


function initializeLine2Container() {
    d3.select(".line2").remove();

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
      // .attr("transform", `translate(0 ${window.innerHeight * 0.05})`)
      .append("g")
      .attr("transform", `translate(${svgWidth * 0.1} 0)`)



    var lines = svgLine2.append("g").attr("class", "lines")
    lines.selectAll(".line-group")
      .data(dataLine2).enter()
      .append('g')
        .attr('class', 'line-group')
        // .attr("transform", `translate(0 100)`)

      .append('path')
      .attr('class', 'PathLine2')
      .attr('d', d => line2(d.values))

      .style('stroke', (d, i) => color(i))
      .style("stroke-width", "3px")
      .style("fill", "transparent")

    var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("0"));

    var yAxis = d3.axisLeft(yScale).ticks(5);


    svgLine2.append("g")
      .attr("class", "xAxis2")
      .attr("transform", `translate(0 ${heightLine2})`)
      .call(xAxis);

    svgLine2.append("g")
      // .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)
      .attr("class", "yAxis2")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("kWh");

      loadDataLine2();
}


function loadDataLine2() {
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

  regionColors = ["#283747", "#F1C40F", "#2471A3", "#229954", "#BA4A00"]


  d3.selectAll(".PathLine2").data(dataLine2).attr('d', d => line2(d.values))
    .style("stroke", function (d, i) { return regionColors[i] } )

  d3.select(".yAxis2").call(yAxis)

  var legend = d3.select(".line2").selectAll(".legend2")
    .data(dataLine2)
    .enter()
    .append("text")
    .attr("class", "legend2")
   .text(function(d) {
      return d.region})
    .attr("x", 100)
    .attr("y", 9)
    .attr("dy", ".40em")
    .style("text-anchor", "start")
    .attr("transform", function(d, i) {
      return "translate(" + svgWidth * 0.73 + " " + i * 20 + ")";
    });



  var legendRects = d3.select(".line2").selectAll(".legend-rect")
    .append("rect")
    .attr("class", "legend-rect")
    .data(dataLine2)
    .enter()
    .append("rect")
      .attr("x", 20)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", function(d, i) {
        return regionColors[i]
      })
      .attr("transform", function(d, i) {
        return "translate(" + svgWidth * 0.80 + " " + i * 20 + ")";
      });

  // d3.select("#line2Div").append("text")
  //     .attr("text-anchor", "middle")
  //     // .attr("transform", `translate(500 ${svgHeight})`)
  //     // .attr("transform", `translate(${svgWidth / 2}, ${-margin.top / 2})`)
  //     .style("font-size", "16px")
  //     .style("text-decoration", "underline")
  //     .attr("id", "titleLine2")
  //
  // d3.select("#titleLine2")
  //   .text(`Graph showing ${categoryOption} per region over time`)
  //   // .attr("transform", `translate(${svgWidth / 2} ${svgHeight / 2})`)
  //   .attr("transform", `translate(-200 0)`)
}


function initializeSlider() {
  var sliderP = d3.select("#mapDiv").append("p").attr("class", "mand")
  .style("position", "absolute")
  // .style("top", "svgHeight")
  .style("top", "25px")
  // .style("right", `${window.innerWidth * 0.1}`)
  var slider = sliderP.append("input")
    .attr("class", "slider")
    .attr("type", "range")
    .attr("id", "mySlider")
    .attr("min", "1995")
    .attr("max", "2014")
    // .style("top", "20px")
    document.getElementById("mySlider").defaultValue = 2000;

    slider.on("change", function(d) {
      showSliderValue(mySlider.value)
      yearOption = mySlider.value;
      loadDataMap()
      loadDataPie();
      addTitles();
      return mySlider.value
    })

  var label = d3.select(".mand").append("label").style("position", "absolute").style("top", "3px")

    // .attr("transform", `translate(${window.innerWidth * 0.05} ${window.innerHeight * 0.05})`)
    // .style("-webkit-appearance", "none")
    .style("position", "absolute")
    .style("top", "3px")
    // .style("left", "8%")

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

      array.push({"cat": Object.keys(groupCategory)[index], "values": Object.values(groupCategory)[index]})
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
        regionArray.push({"Year": parseInt(yearIndex), "Quantity": sum})
      }
      if (Object.keys(groupRegion)[index] != "null") {
        totalArray.push({"region": Object.keys(groupRegion)[index], "values": regionArray})
      }
    }
    return totalArray;
  }
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
    newData.push(elem);
  }
  return newData;
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
  // d3.select("#mapText").remove()
  // d3.select("#pieText").remove()
  // d3.select("#line1Text").remove()
  // d3.select("#line2Text").remove()

  d3.select(".mapTextDiv")
  .text(`Map Chart Showing ${categoryOption} per Country in ${yearOption}`).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "mapText")

  d3.select(".pieTextDiv")
  .text(`Pie Chart Showing Different Categories for ${countryOption} in ${yearOption}`).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "pieText")

  d3.select(".line1TextDiv")
  .text(`Line Graph Showing Different Categories for ${countryOption} over Time`).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "line1Text")

  d3.select(".line2TextDiv")
  .text(`Line Graph Showing ${categoryOption} Values for Different Regions over `).style("vertical-align", "middle").style("text-align", "center")
  .attr("id", "line2Text")
}
