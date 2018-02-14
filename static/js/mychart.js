/*
To generate charts in my blog - linghaol.
*/


/* shared variables */
var boxIsClicked = {
	"clothes-box":true,
	"food-box":true,
	"housing-box":true,
	"other-box":true,
	"transportation-box":true,
	"tuition-box":true
};

var w_bar = $(".bar-area").width();
var h_bar = 350;
var h_pie = $(".pie-area").width();
var w_pie = h_pie;
var outerR = w_pie/2;
var innerR = w_pie/3;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var pie = d3.pie();
var arc = d3.arc()
			.innerRadius(innerR)
			.outerRadius(outerR)
			.padAngle(0.01);
var label = d3.arc()
			  .innerRadius(outerR-30)
			  .outerRadius(outerR-30);
var ratio_arc = d3.arc()
				  .innerRadius(outerR/2-5)
			      .outerRadius(innerR-5)
			      .padAngle(0.01);
var ratio_label = d3.arc()
			  	    .innerRadius(outerR/2-5)
			        .outerRadius(innerR-5);

var title = ["Index", "Time", "Type", "Amount", "Comment"];

/* mouseout */
function mouseout() {
	d3.select(this)
	  .transition()
	  .duration(100)
	  .attr("fill", "#3d903d");
}


/* first-time chart */
function initializeChart(clickBox) {
	/** load data **/
	var total = {};
	for (const [key, value] of Object.entries(stats["ByMonth"])){
		if (key != "special") {
			total[key] = value["total"];
		}
	}
	var len = Object.keys(total).length;
	var key_bar = Object.keys(total);
	var value_bar = Object.values(total);

	/** bar chart **/
	var svg_bar = d3.select(".bar-area")
				.append("svg")
				.attrs({
					class: "mainSVG",
					width: w_bar,
					height: h_bar
				});

	var yScale = d3.scaleLinear()
				   .domain([0, d3.max(value_bar)])
				   .range([h_bar-50, 20]);
		
	var xScale = d3.scaleOrdinal()
				   .domain(key_bar)
				   .range(d3.range(len).map(function(i){
				   		return i*((w_bar-50)/len)+((w_bar-200)/len/2)+40;
				   }));

	var xAxis = d3.axisBottom(xScale);

	var yAxis = d3.axisRight(yScale)
				  .ticks(8);

	svg_bar.append("svg")
	   .attrs({
	   		class: "y-axis",
	   		y: 0
	   })
	   .call(yAxis);

	svg_bar.append("svg")
	   .attrs({
	   		class: "x-axis",
	   		y: h_bar*0.9
	   })
	   .call(xAxis);

	svg_bar.selectAll("rect")
	   .data(value_bar)
	   .enter()
	   .append("rect")
	   .attrs({
	   		class: function(d, i) { return key_bar[i]; },
	   		x: function(d, i) { return i*((w_bar-50)/len)+40; },
	   		y:  function(d) { return yScale(d); },
	   		width: function(d) { return (w_bar-200)/len;  },
	   		height: function(d) { return yScale(0)-yScale(d); },
	   		fill: "#3d903d"
	   	})
	   .on("mouseover", function() {
	   		d3.select(this)
	   		  .attr("fill", "black");
	   })
	   .on("mouseout", mouseout)
	   .on("click", function() {
	   		d3.select(this)
	   		  .on("mouseout", null);
	   		updateChart(boxIsClicked, d3.select(this).attr("class"));
	   		updateTable(boxIsClicked, d3.select(this).attr("class"));
	   	});

	svg_bar.selectAll()
		   .data(value_bar)
		   .enter()
		   .append("text")
		   .attrs({
		   		x: function(d, i) { return i*((w_bar-50)/len)+((w_bar-200)/len/2)+40; },
		   		y:  function(d) { return yScale(d)-10; },
		   		fill: "black",
		   		"font-size": 10,
		   		"text-anchor": "middle",
		   		class: "amount"
		   })
	   	   .text(function(d) { return d.toFixed(1);});

	/** pie chart **/
	var key_pie = Object.keys(stats["ByType"]);
	var value_pie = Object.values(stats["ByType"]);
	var sum = d3.sum(value_pie);

	var pieScale = d3.scaleLinear()
					 .domain([0, d3.max(value_pie)])
					 .range([10, 200])

	var svg_pie = d3.select(".pie-area")
					.append("svg")
					.attrs({
						width: w_pie,
						height: h_pie
					});

	var arcs_pie = svg_pie.append("g")
						  .attrs({
						  	class: "pie",
						  	transform: "translate("+outerR+","+outerR+")"
						  })
						  .selectAll("arc_pie")
						  .data(pie(value_pie.map(pieScale)))
						  .enter()
						  .append("g")
						  .attr("class", function(d, i) { return key_pie[i]; });
	
	arcs_pie.append("path")
			  .attrs({
			  	fill: function(d, i) { return color(i); },
				d: arc
			  })
			  .each(function(d) { this._current = d; });
		
	arcs_pie.append("text")
			.attrs({
				transform: function(d) { return "translate("+label.centroid(d)+")"; },
				"text-anchor": "middle",
				"font-size": 10
			})
			.text(function(d, i) {
				return key_pie[i];
			})
			.each(function(d) { this._current = d; });

	var ratio_pie = svg_pie.append("g")
						   .attrs({
						   		class: "ratio",
						   		transform: "translate("+outerR+","+outerR+")"
						   })
						   .selectAll("ratio")
					 	   .data(pie(value_pie.map(pieScale)))
					 	   .enter()
					 	   .append("g");

	ratio_pie.append("path")	 
			.attrs({
			 	fill: function(d, i) { return color(i); },
				d: ratio_arc
			})
			.each(function(d) { this._current = d; });

	ratio_pie.append("text")
			.attrs({
				transform: function(d) { return "translate("+ratio_label.centroid(d)+")"; },
				"text-anchor": "middle",
				"font-size": 10
			})
			.text(function(d) { return (pieScale.invert(d.value)/sum*100).toFixed(1)+"%"; })
			.each(function(d) { this._current = d; });

	svg_pie.append("text")
		   .attrs({
		   		class: "sumText",
		   		transform: "translate("+outerR+","+(outerR+15)+")",
		   		"text-anchor": "middle",
		   		"font-size": 35
		   })
		   .text(sum.toFixed(1));

	/** selection boxes **/
   	var boxList = Object.keys(stats["ByType"])
   						.filter(function(d) {
   							return d != "total";
   						});

   	var w_box = $(".box-area").width();
   	var h_box = $(".box-area").height();

   	var boxes = d3.select(".boxes")
   				  .append("svg")
   				  .attrs({
   				  	width: w_box,
   				  	height: h_box
   				  });

	boxes.selectAll("rect")
	     .data(boxList)
	     .enter()
	     .append("rect")
	     .attrs({
	     	class: function(d) { return d+"-box"; },
	     	x: 10,
	     	y: function(d, i) { return i*h_box/6+10; },
	     	width: h_box/6-20,
	     	height: h_box/6-20,
	     	fill: "#4f4634",
	     	stroke: "#383225",
	     	"stroke-width": 1,
	     	rx: 3,
	     	ry: 3
	     })
	     .on("mouseover", function() {
	     	d3.select(this)
	     	  .attr("fill", "grey");
	     })
	     .on("mouseout", function() {
	     	if (boxIsClicked[d3.select(this).attr("class")]) {
		     	d3.select(this)
		     	  .attr("fill", "#4f4634");
	     	} else {
		     	d3.select(this)
		     	  .attr("fill", "white");		     		
		     	}
	     })
	     .on("click", function() {
	     	var curClass = d3.select(this).attr("class");
	     	if (boxIsClicked[curClass]) {
	     		boxIsClicked[curClass] = false;
		     	d3.select(this)
		     	  .attr("fill", "white");			     		
	     	} else {
	     		boxIsClicked[curClass] = true;
	     		d3.select(this)
	     	  	  .attr("fill", "#4f4634");
	     	} 
	     });

	boxes.selectAll("text")
		 .data(boxList)
		 .enter()
		 .append("text")
		 .text(function(d) { return d; })
		 .attrs({
		 	x: 50,
		 	y: function(d, i) { return i*h_box/6+27; },
		 	"font-family": "sans-serif",
		 	"font-size": 15,
		 	fill: "black"
		 });
}


/* updation part */
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function labelTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return "translate(" + label.centroid(i(t)) + ")";
  };
} 

function ratio_arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return ratio_arc(i(t));
  };
} 

function ratio_labelTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return "translate(" + ratio_label.centroid(i(t)) + ")";
  };
}

function updateChart(clickBox, time="all") {
	/** load data **/
	if (!(time in stats["ByMonth"]) && (time != "all")){
		return updateChart(boxIsClicked, "all");
	}

	d3.select(".bar-area")
	  .selectAll("rect")
	  .attr("pointer-events", "none")

	var update_bar = {};
	var update_pie = {};
	if (time == "all"){
		for (const [key1, value1] of Object.entries(stats["ByMonth"])){
			if (key1 == "special") { continue; }
			var temp = [];
			for (const [key2, value2] of Object.entries(value1)){
				if (clickBox[key2+'-box']){
					temp.push(value2);
				}
			}
			update_bar[key1] = d3.sum(temp);
		}
		for (key of Object.keys(stats["ByType"])){
			if (clickBox[key+'-box']){
				update_pie[key] = stats["ByType"][key];
			}
		}
	} else {
		for (const [key3, value3] of Object.entries(stats["ByMonth"][time])){
			if (clickBox[key3+'-box']){
					update_bar[key3] = value3;
			}
		}
		update_pie = update_bar;
	}

	/** update chart **/
	/*** bar chart ***/
	var key_bar_update = Object.keys(update_bar);
	var value_bar_update = Object.values(update_bar);
	var len_update = key_bar_update.length;
	
	var xScale_up = d3.scaleOrdinal()
				   	  .domain(key_bar_update)
				      .range(d3.range(len_update).map(function(i){
				      	return i*((w_bar-50)/len_update)+((w_bar-200)/len_update/2)+40;
				   	  }));
	var yScale_up = d3.scaleLinear()
			   		  .domain([0, d3.max(value_bar_update)])
			          .range([h_bar-50, 20]);
	
	var xAxis_up = d3.axisBottom(xScale_up);
	var yAxis_up = d3.axisRight(yScale_up)
			  	     .ticks(8);

	var svg_bar = d3.select(".mainSVG");

	var bar_chart = svg_bar.selectAll("rect").data(value_bar_update);
	bar_chart.exit().remove();
	bar_chart.enter().append("rect")
					 .attrs({
					 	x: function(d, i) { return i*((w_bar-50)/len_update)+800; },
					 	y: yScale_up(0)
					 })
					 .on("mouseover", function() { 
					 	d3.select(this)
	   		  			  .attr("fill", "black");
	   		  		 })
				     .on("click", function() {
				   		d3.select(this)
				   		  .on("mouseout", null);
				   		updateChart(boxIsClicked, d3.select(this).attr("class"));
				   		updateTable(boxIsClicked, d3.select(this).attr("class"));
				   	 });

	bar_chart = svg_bar.selectAll("rect").data(value_bar_update);
	bar_chart.transition()
		     .duration(1500)
		     .attrs({
		     	class: function(d, i) { return key_bar_update[i]; },
  		   		x: function(d, i) { return i*((w_bar-50)/len_update)+40; },
		   		y:  function(d) { return yScale_up(d); },
		   		width: function(d) { return (w_bar-200)/len_update;  },
		   		height: function(d) { return yScale_up(0)-yScale_up(d); },
		   		fill: "#3d903d",
		   		"pointer-events": "none"
		   	  })
		     .on("end", function() {
		   		  d3.select(this)
		   		    .attr("pointer-events", null)
		   		    .on("mouseout", mouseout); 
		     });
	svg_bar.select(".x-axis")
	   	   .transition()
	   	   .duration(1500)
	   	   .call(xAxis_up);

	svg_bar.select(".y-axis")
	   	   .transition()
	   	   .duration(1500)
	   	   .call(yAxis_up);

	var bar_text = svg_bar.selectAll(".amount").data(value_bar_update);
	bar_text.exit().remove();
	bar_text.enter().append("text")
					.text(function(d) { return d.toFixed(1);})
					.attrs({
						x: function(d, i) { return i*((w_bar-50)/len_update)+((w_bar-200)/len_update/2)+800; },
						y: xScale_up(0)-10,
						fill: "black",
				   		"font-size": 10,
				   		"text-anchor": "middle",
				   		class: "amount"
					});
	bar_text = svg_bar.selectAll(".amount").data(value_bar_update);			
    bar_text.transition()
		    .duration(1500)
		    .text(function(d) { return d.toFixed(1);})
		    .attrs({
		   	 	x: function(d, i) { return i*((w_bar-50)/len_update)+((w_bar-200)/len_update/2)+40; },
		   	 	y: function(d) { return d3.min([h_bar-60, yScale_up(d)-10]).toFixed(1); }
		    });

	/*** pie chart ***/
	var key_pie_update = Object.keys(update_pie);
	var value_pie_update = Object.values(update_pie);
	var sum_up = d3.sum(value_pie_update);
	var pieScale_up = d3.scaleLinear()
					 	.domain([0, d3.max(value_pie_update)])
					 	.range([10, 200])


	var pie_chart = d3.select(".pie").selectAll("g").data(pie(value_pie_update.map(pieScale_up)));
	pie_chart.exit().remove();

	var handle = pie_chart.enter().append("g")
					 .attr("class", function(d, i) { return key_pie_update[i]; });
	handle.append("path")
		  .attrs({
		 	fill: function(d, i) { return color(i); },
		 	d: arc
		  })
		  .each(function(d) { this._current = d; });

	d3.select(".pie").selectAll("path")
					 .data(pie(value_pie_update.map(pieScale_up))).transition().duration(1500)
	   		 		 .attrTween("d", arcTween);

    handle.append("text")
		  .attrs({
		  	transform: function(d) { return "translate("+label.centroid(d)+")"; },
			"text-anchor": "middle",
			"font-size": 10
		  })
		  .each(function(d) { this._current = d; });

	d3.select(".pie").selectAll("text")
					 .data(pie(value_pie_update.map(pieScale_up))).transition().duration(1500)
	   		 		 .attrTween("transform", labelTween)
	   		 		 .text(function(d, i) { return key_pie_update[i]; });

	var ratio_chart = d3.select(".ratio").selectAll("g").data(pie(value_pie_update.map(pieScale_up)));
	ratio_chart.exit().remove();

	var handle_ratio = ratio_chart.enter().append("g")
					 			  .attr("class", function(d, i) { return key_pie_update[i]+"-ratio"; });

	handle_ratio.append("path")
			    .attrs({
			 	  fill: function(d, i) { return color(i); },
			 	  d: label
			    })
			    .each(function(d) { this._current = d; });

	d3.select(".ratio").selectAll("path")
					   .data(pie(value_pie_update.map(pieScale_up))).transition().duration(1500)
	   		 		   .attrTween("d", ratio_arcTween);

    handle_ratio.append("text")
			    .attrs({
			  	  transform: function(d) { return "translate("+ratio_label.centroid(d)+")"; },
				  "text-anchor": "middle",
				  "font-size": 10
			    })
			    .each(function(d) { this._current = d; });

	d3.select(".ratio").selectAll("text")
					 .data(pie(value_pie_update.map(pieScale_up))).transition().duration(1500)
	   		 		 .attrTween("transform", ratio_labelTween)
	   		 		 .text(function(d) { return (pieScale_up.invert(d.value)/sum_up*100).toFixed(1)+"%"; });
	
	d3.select(".sumText")
	  .transition()
	  .duration(1500)
	  .text(sum_up.toFixed(1));	
}

/* update table */
function updateTable(clickBox, time='all') {
	console.log(time);
	if (!(time in record) && (time != "all")){
		return updateTable(clickBox, "all");
	}

	var title_lower = title.map(function(d) { 
		return d.toLowerCase();
	});
	var data = [];
	var count = 0;
	if (time == "all") {
		for (key of Object.keys(record).slice().reverse()) {
			for (rec of record[key].slice().reverse()) {
				if (count >= 15) {
					break;
				} else {
					if (clickBox[rec["type"]+'-box']) {
						rec["index"] = count;
						data.push(rec);
						count += 1;
					}
				}
			}
			if (count >= 15) {
				break;
			}
		}
	} else {
		for (rec of record[time].slice().reverse()) {
			if (count >= 15) {
				break;
			} else {
				if (clickBox[rec["type"]+'-box']) {
					rec["index"] = count;
					data.push(rec);
					count += 1;
				}
			}
		}
	}
	d3.select(".record-area table").select("tbody").remove()
	var table_body = d3.select(".record-area table").append("tbody")
					   .selectAll("tr")
					   .data(data).enter()
					   .append("tr");
	table_body.selectAll("td")
	      	  .data(function(d) { 
	      	  	return title_lower.map(function(col) { 
	      	  		return d[col];
	      		});
	      	  })
	      	  .enter()
	      	  .append("td")
	      	  .text(function(d) { 
	      	  	return d; 
	      	  });
}

/* reset part */
function reset() {
	for (var key of Object.keys(boxIsClicked)) {
		boxIsClicked[key] = true;
	}
	d3.select(".boxes").selectAll("rect")
					   .attr("fill", "#4f4634");                   
}


/* main program */
d3.select(".record-area table").append("thead").append("tr")
  .selectAll("th")
  .data(title).enter()
  .append("th")
  .text(function(d) { return d; });

var stats;
var record;

d3.json('/load/fee_stats', function(json) {
	stats = json;
	initializeChart(boxIsClicked);
});

d3.json('/load/fee_record', function(json) {
	record = json;
	updateTable(boxIsClicked, "all");
});


d3.select(".reset-button")
  .on("click", function() {
  	reset();
  	updateChart(boxIsClicked, "all");
  	updateTable(boxIsClicked, "all");
  });