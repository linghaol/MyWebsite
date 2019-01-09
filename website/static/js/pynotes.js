/*
build and update PyNotes page
*/

var H = 180
var W = 30
var num = d3.selectAll(".note").size()

function build_jumper() {
	d3.select(".jumper")
	  .selectAll()
	  .data(["jumper-line", "jumper-button"])
	  .enter()
	  .append("svg")
	  .attr("class", function(d){ return d; })

	d3.select(".jumper-line")
	  .append('line')
	  .attrs({
	  		x1: W/2,
	  		y1: 0,
	  		x2: W/2,
	  		y2: document.body.scrollHeight - 230,
	  		style: "stroke:#4e4e4e; stroke-width:2;"
	  })

	d3.select(".jumper-button")
		  .selectAll()
		  .data(d3.range(1, num+1))
		  .enter()
		  .append('a')
		  .attr("href", function(d){ return "#note" + d; })

	d3.select(".jumper-button")
		  .selectAll('a')
		  .append('circle')
		  .attrs({
		  		cx: W/2,
		  		cy: function(d){ return H/(num+1)*d; },
		  		r: 4,
		  		fill: "white",
		  		stroke: "black",
		  		"stroke-width": 1.5
		  })
		  .on("mouseover", function(){
		  		d3.select(this)
		  		  .transition()
		  		  .duration(200)
		  		  .attrs({
		  		  		r: 7,
		  		  		fill: "#fde1ab"
		  		  })
		  })
		  .on("mouseout", function(){
		  		d3.select(this)
		  		  .transition()
		  		  .duration(200)
		  		  .attrs({
		  		  		r: 4,
		  		  		fill: "white"
		  		  })
		  })
}


build_jumper()

d3.selectAll(".note-title")
  .on("click", function(){
  		var element = d3.select(this.parentNode)
  						.select("#note-content")
  		if (element.attr("class") == "note-content-hidden") {
  			element.attr("class", "note-content-show")
  		} else {
  			element.attr("class", "note-content-hidden")
  		}
  		var handler = d3.select(".jumper-line")
  						.style("height", document.body.scrollHeight - 230)
  		handler.select(".jumper-line line")
  		  	   .attr("y2", document.body.scrollHeight - 230)
		})


