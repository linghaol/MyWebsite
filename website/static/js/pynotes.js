/*
build and update PyNotes page
*/

function build_jumper_line() {
	d3.select(".jumper-line")
	  .append('line')
	  .attrs({
	  		x1: W/2,
	  		y1: 0,
	  		x2: W/2,
	  		y2: document.body.scrollHeight - 230,
	  		style: "stroke:#4e4e4e; stroke-width:2;"
	  })
}


function build_jumper_button(start, num) {
	var jumper_button = d3.select(".jumper-button")

	jumper_button.selectAll()
				 .data(d3.range(start+1, num+1))
				 .enter()
				 .append('a')
				 .attr("href", function(d){ return "#note" + d; })

	jumper_button.selectAll('a')
				  .each(function(){
				 		d3.select(this)
				 		  .append("circle")
				 		  .attrs({
						  		 cx: W/2,
						  		 cy: 200,
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
						  		  		fill: "#ffea69"
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
				  })

	jumper_button.selectAll('a')
				 .transition()
				 .duration(2000)
				 .attr("transform", function(d){ return "translate(0, " + -(200-H/(num+1)*d) + ")"; })
}


function update_jumper_button(start, end) {
	build_jumper_button(start, end)
}


/* main program starts here */

var H = 180
var W = 30

d3.select(".jumper")
  .selectAll()
  .data(["jumper-line", "jumper-button"])
  .enter()
  .append("svg")
  .attr("class", function(d){ return d; })

build_jumper_line()

build_jumper_button(0, d3.selectAll(".note").size())

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

d3.select(".show-more")
  .on("click", function(){
  		var num_pre = 2
		/* load more notes*/

		/* update jumper-button */
		var num_aft = d3.selectAll(".note").size()
		update_jumper_button(num_pre, num_aft)
	})
