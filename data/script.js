const fileName = "json.json"
const data = [];
const data2 = [];

var categoryOption = "Combustion";
var yearOption = "2014";
var countryOption = "DEU";

let svgWidth = "40%";
let svgHeight = "350";

colorSheme = ["#1f77b4",  "#ff7f0e", "#17becf", "#8c564b", "black", "#7f7f7f", "#d62728"]
colorDomain = ["Hydro", "Solar", "Wind", "Combustion", "Nuclear", "Other", "Geothermal"]
var color = d3.scaleOrdinal(colorSheme)
  // .range(["blue", "green", "yellow"])
  .domain(colorDomain)

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
  // console.log(data)
  // console.log(data2)
  // dataArray = processingfunctie(response);
  // processedData = dataArray;
  initializeMapContainer()
  initializePieContainer()
  initializeLine1Container()
  initializeLine2Container()
  initializeSlider()

  // console.log(filterData("line1"))
  // makeMapChart()



  }).catch(function(e){
      throw(e);
  });
};

function initializeMapContainer() {
  var width = window.innerWidth * .4,
  height = "350";
  var path = d3.geoPath();

  var svgMap = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${window.innerWidth * .05} 0)`)
      .attr("class", "svgMap")
      .append("g")
      .attr("class", "gMap")

  var topojson = Promise.resolve(d3.json("world_countries.json"));
  topojson.then(function(value) {
    console.log(value)

    var projection = d3.geoMercator()
                       .scale(130)
                      .translate( [width / 2, height / 1.5]);

    var path = d3.geoPath().projection(projection);


    svgMap.append("g").attr("class", "countries")
      .selectAll("path")
      .data(value.features)
    .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "hier")
      .on("click", function(geography) {
        console.log(geography)
      })

    loadDataMap();
})
}

function loadDataMap() {
  // console.log(getValues(filterData("worldmap")))
  valueArray = [];
  for (var elem of filterData("worldmap")) {
    valueArray.push(elem.Quantity)
  }

  // var colorMap = d3.scaleThreshold()
  //   .domain([0, 60000])
  //   .range(["rgb(247,251,255)", "rgb(3,19,43)"]);
  var colorMap = d3.scaleQuantize()
    .domain([0,600000])
    .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);

  d3.selectAll(".hier").data(filterData("worldmap")).style("fill", function(d) {
    return colorMap(d.Quantity)
  })


}

function initializeMapContainer2() {

  // var colorMap = d3.scaleThreshold()
  //   .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
  //   .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);
  var colorMap = d3.scaleThreshold()
    .domain([0, 60000])
    .range(["rgb(247,251,255)", "rgb(3,19,43)"]);

  // var paddingLeft
  var dataMap = filterData("worldmap")
  var svgMap = d3.select("body")
    .append("svg")
    .attr("id", "choroplethSVG")
    .attr("width", `${svgWidth}`)
    .attr("height", `${svgHeight}`)
    .append("g")
    .attr("class", "map")
    .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)

  var projection = d3.geoMercator()
                     .scale(130)
                     .translate([0, 0])
  var path = d3.geoPath().projection(projection);

  // var dataMapById = {};
  dataMap = filterData("worldmap");

  // dataMap.forEach(function(d) { dataMapById[d.id] = +d.dataMap; });
  // data.features.forEach(function(d) { d.dataMap = dataMapById[d.id] });

  svgMap.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(dataMap)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) {
        return colorMap(d.Quantity); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity", 0.8)
      // // tooltips
      //   .style("stroke","white")
      //   .style('stroke-width', 0.3)
      //   .on('mouseover',function(d){
      //     tip.show(d);
      //
      //     d3.select(this)
      //       .style("opacity", 1)
      //       .style("stroke","white")
      //       .style("stroke-width",3);
      //   })
      //   .on('mouseout', function(d){
      //     tip.hide(d);
      //
      //     d3.select(this)
      //       .style("opacity", 0.8)
      //       .style("stroke","white")
      //       .style("stroke-width",0.3);
      //   });

  svgMap.append("path")
    .data(dataMap)
    // .data(topojson.mesh(dataMap, function(d) {
    //   return d
    // }))
      // .datum(topojson.mesh(dataMap, function(d) {
      //   console.log(d)
      //   return d.ISO; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      // .attr("d", path);
      .attr("d", function(d) {
        console.log(path)
      })
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
  }


function initializePieContainer() {
  var dataPie = filterData("pie");
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
    .attr("transform", `translate(${window.innerWidth * 0.15} 0)`)
    // .attr("class", "pie")
    .append("g")
    .attr("transform", `translate(${window.innerWidth * 0.15} 175)`)

    var g = svgPie.selectAll(".arc")
       .data(pie(dataPie))
     .enter().append("g")
       .attr("class", "arc");

   g.append("path")
      .attr("class", "piePath")
       .attr("d", arc)
       .style("fill", function(d) {
         return color(d.data.categoryTag); });


   g.append("text")
       .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")" + "rotate(" + getAngle(d) + ")"; })
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
}


function loadDataPie() {
  // console.log("MAND")
  var widthPie = window.innerWidth * 0.4,
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

  d3.selectAll(".piePath").data(pieData).attr("d", arc).style("fill", function(d) {
    return color(d.data.categoryTag)
  })
  d3.selectAll(".pieText").data(pieData)
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

}


function initializeLine1Container() {

  var dataLine1 = filterData("line1")

  var yValues = getValues(dataLine1, categoryOption);


  var maxY = Math.max.apply(Math, yValues);

  // console.log((d3.extent(dataLine1[0].values, d => d.Year)))
  // console.log(maxY)
  // var minY = Math.min.apply(Math, yValues);
  // console.log(minY)

  var margin = {top: 50, right: 50, left: 50, bottom: 50},
    widthLine1 = window.innerWidth * 0.4 - margin.left - margin.right,
    heightLine1 = 350 - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y");

  var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine1]);

  var yScale = d3.scaleLinear().domain([0, maxY]).range([heightLine1, 0]);

  // var dataset = d3.range(25).map(function(d) {
  //    return {"y": parseInt(Object.values(dataLine1)[d]), "year": parseInt(Object.keys(dataLine1)[d]) } })

  /// VALUES OF LINES?????????????????????????????

  // var line = d3.line()
  // .x(function(d) {
  //   // console.log(xScale(d.year))
  //   return xScale(d.year)})
  // .y(function(d) { return yScale(d.y)})

  var line = d3.line()
  .x(d => xScale(d.Year))
  // .x(function(d) {
  //   console.log(xScale(d.Year))
  //   console.log(d.Quantity)
  //   return(xScale(d.Year))
  // })
  .y(d => yScale(d.Quantity));



  var svgLine1 = d3.select("body")
    .append("svg")
    .attr("width", `${svgWidth}`)
    .attr("width", "50%")
    .attr("height", `${svgHeight}`)
    .attr("class", "line1")
    // .attr("transform", `translate(${window.innerWidth * 0.05} ${window.innerHeight * 0.05})`)
    .attr("transform", `translate(0 ${window.innerHeight * 0.05})`)
    .append("g")

    // .atrr("transform", "translate/../.,l;dfa")

    // dataLine1.forEach(fcuntion(d) {
    //   d.date
    // })
  // console.log(dataLine1)

  var lines = svgLine1.append("g").attr("class", "lines")
  lines.selectAll(".line-group")
    .data(dataLine1).enter()
    .append('g')
      .attr('class', 'line-group')
      .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)
      // .on("mouseover", function(d, i) {
      //     svg.append("text")
      //       .attr("class", "title-text")
      //       .style("fill", color(i))
      //       .text(d.name)
      //       .attr("text-anchor", "middle")
      //       .attr("x", (width-margin)/2)
      //       .attr("y", 5);
      //   })
      //   .on("mouseout", function(d) {
      //   svg.select(".title-text").remove();
      // })
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    // .attr("d", function(d) {
    //   console.log(line(d.values))
    // })
    // .attr('d',function(d) {
    //   console.log(line(d.values))
    //   console.log(Object.values(d))
    //   console.log(line(Object.values(d)))
    //   console.log(line(d["Combustion"]))
    //   // console.log(line(dataLine1[categoryOption]))
    //   return line(d["Combustion"])
    // })
    .style('stroke', (d, i) => color(i))
    .style("fill", "transparent")
    // .style('opacity', lineOpacity)
    // .on("mouseover", function(d) {
    //     d3.selectAll('.line')
  	// 				.style('opacity', otherLinesOpacityHover);
    //     d3.selectAll('.circle')
  	// 				.style('opacity', circleOpacityOnLineHover);
    //     d3.select(this)
    //       .style('opacity', lineOpacityHover)
    //       .style("stroke-width", lineStrokeHover)
    //       .style("cursor", "pointer");
    //   })
    // .on("mouseout", function(d) {
    //     d3.selectAll(".line")
  	// 				.style('opacity', lineOpacity);
    //     d3.selectAll('.circle')
  	// 				.style('opacity', circleOpacity);
    //     d3.select(this)
    //       .style("stroke-width", lineStroke)
    //       .style("cursor", "none");
    //   });
    // svgLine1.append("path")
    //   // .data([filterData("line1")])
    //   .datum(dataset)
    //   .attr("class", "line")
    //   .style("stroke", "black")
    //   .attr("d", line)
      // .attr("d", function(d) {
      //   console.log(d)
      //   return parseInt(d.Combustion)})
  var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("0"));

  var yAxis = d3.axisLeft(yScale).ticks(5);


  svgLine1.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(${window.innerWidth * 0.05} ${heightLine1})`)
    .call(xAxis);

  svgLine1.select(".x axis").selectAll("text").style("font-size", "1px")

  svgLine1.append("g")
    .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Total values");
  }


function initializeLine2Container() {
    var dataLine2 = filterData("line2")

    var yValues = getValues(dataLine2, categoryOption);


    var maxY = Math.max.apply(Math, yValues);

    // console.log((d3.extent(dataLine1[0].values, d => d.Year)))
    // console.log(maxY)
    // var minY = Math.min.apply(Math, yValues);
    // console.log(minY)

    var margin = {top: 50, right: 50, left: 50, bottom: 50},
      widthLine2 = window.innerWidth * 0.4 - margin.left - margin.right,
      heightLine2 = 350 - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%Y");

    var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine2]);

    var yScale = d3.scaleLinear().domain([0, maxY]).range([heightLine2, 0]);

    var line2 = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Quantity));



    var svgLine2 = d3.select("body")
      .append("svg")
      .attr("width", `${svgWidth}`)
      .attr("width", "50%")
      .attr("height", `${svgHeight}`)
      .attr("class", "line2")
      .attr("transform", `translate(0 ${window.innerHeight * 0.05})`)
      .append("g")

      // .atrr("transform", "translate/../.,l;dfa")

      // dataLine1.forEach(fcuntion(d) {
      //   d.date
      // })
    // console.log(dataLine2)

    var lines = svgLine2.append("g").attr("class", "lines")
    lines.selectAll(".line-group")
      .data(dataLine2).enter()
      .append('g')
        .attr('class', 'line-group')
        .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)
        // .on("mouseover", function(d, i) {
        //     svg.append("text")
        //       .attr("class", "title-text")
        //       .style("fill", color(i))
        //       .text(d.name)
        //       .attr("text-anchor", "middle")
        //       .attr("x", (width-margin)/2)
        //       .attr("y", 5);
        //   })
        //   .on("mouseout", function(d) {
        //   svg.select(".title-text").remove();
        // })
      .append('path')
      .attr('class', 'PathLine2')
      .attr('d', d => line2(d.values))
      // .attr("d", function(d) {
      //   console.log(line2(d.values))
      // })
      // .attr('d',function(d) {
      //   console.log(line(d.values))
      //   console.log(Object.values(d))
      //   console.log(line(Object.values(d)))
      //   console.log(line(d["Combustion"]))
      //   // console.log(line(dataLine1[categoryOption]))
      //   return line(d["Combustion"])
      // })
      .style('stroke', (d, i) => color(i))
      .style("fill", "transparent")
      // .style('opacity', lineOpacity)
      // .on("mouseover", function(d) {
      //     d3.selectAll('.line')
      // 				.style('opacity', otherLinesOpacityHover);
      //     d3.selectAll('.circle')
      // 				.style('opacity', circleOpacityOnLineHover);
      //     d3.select(this)
      //       .style('opacity', lineOpacityHover)
      //       .style("stroke-width", lineStrokeHover)
      //       .style("cursor", "pointer");
      //   })
      // .on("mouseout", function(d) {
      //     d3.selectAll(".line")
      // 				.style('opacity', lineOpacity);
      //     d3.selectAll('.circle')
      // 				.style('opacity', circleOpacity);
      //     d3.select(this)
      //       .style("stroke-width", lineStroke)
      //       .style("cursor", "none");
      //   });
      // svgLine1.append("path")
      //   // .data([filterData("line1")])
      //   .datum(dataset)
      //   .attr("class", "line")
      //   .style("stroke", "black")
      //   .attr("d", line)
        // .attr("d", function(d) {
        //   console.log(d)
        //   return parseInt(d.Combustion)})
    var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("0"));

    var yAxis = d3.axisLeft(yScale).ticks(5);


    svgLine2.append("g")
      .attr("class", "xAxis2")
      .attr("transform", `translate(${window.innerWidth * 0.05} ${heightLine2})`)
      .call(xAxis);

    // svgLine2.select(".xAxis2").selectAll("text").style("font-size", "1px")

    svgLine2.append("g")
      .attr("transform", `translate(${window.innerWidth * 0.05} 0)`)
      .attr("class", "yAxis2")
      .call(yAxis)
      .append('text')
      .attr("y", 15)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("kWh");

}


function loadDataLine2() {
  var margin = {top: 50, right: 50, left: 50, bottom: 50},
    widthLine2 = window.innerWidth * 0.4 - margin.left - margin.right,
    heightLine2 = 350 - margin.top - margin.bottom;

  var dataLine2 = filterData("line2");

  var yValues = getValues(dataLine2, categoryOption);


  var maxY = Math.max.apply(Math, yValues);

  var parseTime = d3.timeParse("%Y");

  var xScale = d3.scaleTime().domain([1990, 2014]).range([0, widthLine2]);

  var yScale = d3.scaleLinear().domain([0, maxY]).range([heightLine2, 0]);

  var line2 = d3.line()
  .x(d => xScale(d.Year))
  // .x(function(d) {
  //   console.log(xScale(d.Year))
  //   console.log(yScale(d.Quantity))
  //   return(xScale(d.Year))
  // })
  .y(d => yScale(d.Quantity));

  var yAxis = d3.axisLeft(yScale).ticks(5);

  // var xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("0"));

  d3.selectAll(".PathLine2").data(dataLine2).attr('d', d => line2(d.values))
  // d3.select(".xAxis2").call(xAxis)
  d3.select(".yAxis2").call(yAxis)
}


function initializeSlider() {
  var sliderP = d3.select("body").append("p").attr("class", "mand").style("position", "absolute").style("top", "200px").style("right", `${window.innerWidth * 0.1}`)
  var slider = sliderP.append("input")
    .attr("class", "slider")
    .attr("type", "range")
    .attr("id", "mySlider")
    .attr("min", "1995")
    .attr("max", "2015")
    .on("change", function(d) {
      showSliderValue(mySlider.value)
      yearOption = mySlider.value;
      loadDataMap()
      loadDataPie();
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
    loadDataMap();
    loadDataPie();
    loadDataLine2();
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

  // else if (spec == "line1") {
  //   var groupCountry = _.groupBy(allData, obj => obj.ISO);
  //   var groupYear = _.groupBy(groupCountry[countryOption], obj => obj.Year);
  //
  //   var yearDict = {};
  //   for (var year of Object.values(groupYear)) {
  //     var categoryDict = {}
  //     var groupCategory =  _.groupBy(year, obj => obj.categoryTag);
  //     for (var category of Object.values(groupCategory)) {
  //       for (var country of Object.values(category)) {
  //         if (!isNaN(categoryDict[country.categoryTag])) {
  //           categoryDict[country.categoryTag] = parseInt(categoryDict[country.categoryTag]) + parseInt(country.Quantity)
  //         }
  //         else {
  //           categoryDict[country.categoryTag] = parseInt(country.Quantity)
  //         }
  //       }
  //     }
  //     yearDict[year[0].Year] = categoryDict
  //   }
  //   console.log(yearDict)
  //   return yearDict
  // }
  else if  (spec == "line1") {
    var groupCountry = _.groupBy(allData, obj => obj.ISO);
    // console.log(groupCountry[countryOption])
    var groupCategory = _.groupBy(groupCountry[countryOption], obj => obj.categoryTag);
    array = [];
    for (var index in Object.values(groupCategory)) {

      array.push({"cat": Object.keys(groupCategory)[index], "values": Object.values(groupCategory)[index]})
    }
    return array;
  }

  else if (spec == "line2") {
    var groupCategory = _.groupBy(allData, obj => obj.categoryTag);
    // var groupYear = _.groupBy(groupCategory[categoryOption], obj => obj.Year)
    totalArray = [];
    var groupRegion =  _.groupBy(groupCategory[categoryOption], obj => obj.Region);
    for (var index in Object.values(groupRegion)) {
      regionArray = [];
      key = Object.keys(groupRegion)[index]
      value = Object.values(groupRegion)[index]
      // console.log(value)
      var groupYear =  _.groupBy(value, obj => obj.Year);
      for (var yearIndex in groupYear) {
        sum = 0;
        for (var elem of groupYear[yearIndex]) {
          sum += elem.Quantity
        }
        // regionDict[yearIndex] = sum
        regionArray.push({"Year": parseInt(yearIndex), "Quantity": sum})
      }
      // if (!isNaN(yearDict[key])) {
      //   yearDict[key] = yearDicht[key].Quantity + value.Quantity
      // }
      // else {
      //   yearDict[key] = value.Quantity
      // }
      totalArray.push({"region": Object.keys(groupRegion)[index], "values": regionArray})
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
