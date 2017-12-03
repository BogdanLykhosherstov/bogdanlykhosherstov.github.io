
//VARIOUS CODE PIECES TAKE FROM bl.ocks.org EXAMPLES ON GEOGRAPHICAL MAPPING

//

function obesity(){
d3.selectAll(".first").remove();

var width = 675;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var color = d3.scale.linear()
			  .range(["#01084f","#631e50","#a73c5a","#ff7954"]);

var legendText = ["Obesity: >29%", "Obesity: <=29%", "Obesity: <=26%", "Obesity: <=23%"];
var graphName = ["Percentage of Obesity across states"];
//Create SVG element and append map to the SVG
var svg = d3.select(".wrapper")
			.append("svg")
			.attr("class", "first")
			.attr("width", width)
			.attr("height", height);
svg.append("text")
  		  .data(graphName)
      	  .attr("x", 500)
		  .attr("font-weight", "bold")
      	  .attr("y", 10)
      	  .attr("dy", ".70em")
      	  .text(function(d) { return d; });

// Append Div for tooltip to SVG
var div = d3.select(".wrapper")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);
var pointerBox = d3.select('body').append('div')
			.attr('class', 'pointerBox')
			.style('position', 'absolute')
			.style('background', '#01084f')
			.style('padding', '5px 15px')
			.style('border', '1px ##ffc107 solid')
			.style('border-radius', '4px')
			.style('color', '#ffc107')
			.style('opacity', '0');
// Load in my states data!
d3.csv("stateslived.csv", function(data) {
color.domain([0,1,2,3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].state;

	// Grab data value
	var dataValue = data[i].visited;

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.visited = dataValue;

		// Stop looking through the JSON
		break;
		}
	}
}

// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#000")
	.style("stroke-width", "1")
	.on('mouseover', function(d){
	  pointerBox
		  .style('opacity', 1)
	  pointerBox.html(function(){
		  return d.properties.name;})
		  .style('left', (d3.event.pageX)+'px')
		  .style('top', (d3.event.pageY)+'px')
	})
	.on("click", function(d){
		pieGraph(false, d.properties.name);

	})
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.visited;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});




// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
var legend = d3.select(".wrapper").append("svg")
      			.attr("class", "legend first")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});

});
}
$(function(){
	obesity()});
function pieGraph(flag, stateName){
	d3.selectAll(".pieChart").remove();
	d3.selectAll(".pieChart2").remove();
	d3.selectAll(".pieChart3").remove();

	d3.select(".stateName")
		.text(function(){
			return stateName;
		});
	var w = 200,                        //width
	h = 200,                            //height
	r = 90,                            //radius
	color = d3.scale.category20c();
	color2 = d3.scale.category20b();    //builtin range of colors
	var newData;
	dataList = [{"label":"Good", "value":20},
			{"label":"Obese", "value":50},
			{"label":"Overweight", "value":30}];
	dataList1 = [{"label":"Exercises", "value":70},
			{"label":"Don't Exercise", "value":30}
			];
	dataList2 = [{"label":"Above Poverty", "value":30},{"label":"Poverty", "value":70}

			];
	d3.csv("data.csv", function(error, data){
		for (element of data){

			if(element.State == stateName){
				newData = element;
			}
		}
		dataList[0].value = newData.Good;
		dataList[1].value = newData.Obese;
		dataList[2].value = newData.Overweight;

		dataList1[0].value = newData.Exercise;
		dataList1[1].value = (100 - (newData.Exercise))+"";

		dataList2[1].value = newData.Poverty_Rate;
		dataList2[0].value = (100 - (newData.Poverty_Rate))+"";
		console.log(dataList, dataList1, dataList2);

		var vis = d3.select(".second")
			.append("svg:svg")              //create the SVG element inside the <body>
			.data([dataList])
			    .attr("class", "pieChart")               //associate our data with the document
				.attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
				.attr("height", h)
			.append("svg:g")                //make a group to hold our pie chart
				.attr("transform", "translate(" + r + "," + r + ")");
		var vis2 = d3.select(".second")
			.append("svg:svg")
			            //create the SVG element inside the <body>
			.data([dataList1])
				.attr("class", "pieChart2")               //associate our data with the document
				.attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
				.attr("height", h)
			.append("svg:g")                //make a group to hold our pie chart
				.attr("transform", "translate(" + (r + 200)+"," + r + ")");
		var vis3 = d3.select(".second")
			.append("svg:svg")              //create the SVG element inside the <body>
			.data([dataList2])
			    .attr("class", "pieChart3")               //associate our data with the document
				.attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
				.attr("height", h)
			.append("svg:g")                //make a group to hold our pie chart
				.attr("transform", "translate(" + (r+400) + "," + r + ")");



    //move the center of the pie chart from 0, 0 to radius, radius

		var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
			.outerRadius(r);

		var pie = d3.layout.pie()           //this will create arc data for us given a list of values
			.value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

		var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
			.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
				.append("pieChart:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
					.attr("class", "slice");    //allow us to style things in the slices (like text)

			arcs.append("pieChart:path")
					.attr("fill", function(d, i) { return color2(i); } ) //set the color for each slice to be chosen from the color function defined above
					.attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

			arcs.append("pieChart:text")                                     //add a label to each slice
					.attr("transform", function(d) {                    //set the label's origin to the center of the arc
					//we have to make sure to set these before calling arc.centroid
					d.innerRadius = 0;
					d.outerRadius = r;
					return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
				})
				.attr("text-anchor", "middle")                          //center the text on it's origin
				.text(function(d, i) { return dataList[i].label; });
		var arcs = vis2.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
			.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
				.append("pieChart2:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
					.attr("class", "slice");    //allow us to style things in the slices (like text)

			arcs.append("pieChart2:path")
					.attr("fill", function(d, i) { return color2(i); } ) //set the color for each slice to be chosen from the color function defined above
					.attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

			arcs.append("pieChart2:text")                                     //add a label to each slice
					.attr("transform", function(d) {                    //set the label's origin to the center of the arc
					//we have to make sure to set these before calling arc.centroid
					d.innerRadius = 0;
					d.outerRadius = r;
					return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
				})
				.attr("text-anchor", "middle")                          //center the text on it's origin
				.text(function(d, i) { return dataList1[i].label; });
		var arcs = vis3.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
			.enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
				.append("pieChart3:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
					.attr("class", "slice");    //allow us to style things in the slices (like text)

			arcs.append("pieChart3:path")
					.attr("fill", function(d, i) { return color2(i+1); } ) //set the color for each slice to be chosen from the color function defined above
					.attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

			arcs.append("pieChart3:text")                                     //add a label to each slice
					.attr("transform", function(d) {                    //set the label's origin to the center of the arc
					//we have to make sure to set these before calling arc.centroid
					d.innerRadius = 0;
					d.outerRadius = r;
					return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
				})
				.attr("text-anchor", "middle")                          //center the text on it's origin
				.text(function(d, i) { return dataList2[i].label; });     //get the label from our original data array
	//Now, render the cereal chart
	cerealGraph(newData.Favorite);
	});


}
function cerealGraph(favorite){

	d3.selectAll(".head").remove();
	d3.selectAll(".rowText").remove();
	d3.csv("CerealData.csv", function(data){
		var cereal = cerealFilt(favorite, data);
		cerealVis(cereal);
	});



}
function cerealFilt(cerealName, data) {
	var cereal = data.filter(function(d) {
	return d.Brand == cerealName;
	});
	return cereal[0];
}
function cerealVis(cereal) {
  var main = d3.select(".wrapper3").append("div").attr("class", "head");
  var main2 = d3.select('.wrapper3').append("div").attr("class", "rowText");
  for (var key in cereal) {
	if (cereal.hasOwnProperty(key)) {
	  main.append("div")
		.append("p")
		.text(key + ": "+'\n'+cereal[key]);

	}
  }

}
