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

	var jumper_button = d3.select(".jumper-button")

	jumper_button.selectAll()
				 .data(d3.range(1, num+1))
				 .enter()
				 .append('a')
				 .attr("href", function(d){ return "#note" + d; })

	jumper_button.selectAll('a')
				  .append('circle')
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

	jumper_button.selectAll('a')
				 .transition()
				 .duration(2000)
				 .attr("transform", function(d){ return "translate(0, " + -(200-H/(num+1)*d) + ")"; })
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

d3.select(".show-more")
  .on("click", function(){
  		var num_pre = num
  		/* load more notes*/
  		/* update jumper-button */
  		var num_aft = d3.selectAll(".note").size()
  		var jumper_button = d3.select(".jumper-button")
  		jumper_button.selectAll()
			  		 .data(d3.range(num_pre+1, num_aft+1))
			  		 .enter()
			  		 .append("a")
					 .attr("href", function(d){ return "#note" + d; })
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



		jumper_button.selectAll("a")
					 .transition()
					 .duration(2000)
					 .attr("transform", function(d){ return "translate(0, " + -(200-H/(num_aft+1)*d) + ")"; })
  		})



