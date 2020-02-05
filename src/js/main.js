var paywall = require("./lib/paywall");
setTimeout(() => paywall(12345678), 5000);

require("waypoints/lib/noframework.waypoints.min");
var d3 = Object.assign({}, require("d3-scale"), require("d3-shape"), require("d3-selection"));
require("./brightcove");

// once user has scrolled to beginning of story, fade out hero looper
var beginning = document.querySelector("#beginning"),
	hero_looper = document.querySelector(".hero__figure");

function animateHero() {
	new Waypoint({
	  element: beginning,
	  offset: "95%",
	  handler: function(direction) {
	  	if (direction === "down") {
	  		hero_looper.classList.remove("shown");
	  		hero_looper.classList.add("hidden");
	  	} else {
	  		hero_looper.classList.remove("hidden");
	  		hero_looper.classList.add("shown");
	  	}
	  }
	});
}

animateHero();

///////////////// SCHOOL STAFF PIE CHARTS /////////////////

var data = require("../../data/support-staff.sheet.json"),
mapped_data = data.map(function(d) {
	return {
		pie_data: [d.percentage, 100 - d.percentage],
		text: d.text
	}
});

var color = d3.scaleOrdinal(["#276baf", "#cccccc"]);
var pies = Array.from(document.querySelectorAll(".pie-chart"));

pies.forEach(function(pie, i) {
	var svg = d3.select(pie)
		.attr("width", "60")
		.attr("height", "60"),
		g = svg.append("g").attr("transform", "translate(30, 30)");
	var data = mapped_data[i].pie_data;
  var pie = d3.pie()
  	.sort(null);
  var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(30);

  var arcs = g.selectAll("arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

	 arcs.append("path")
	  .attr("fill", function(d, i) {
	  	return color(i);
	  })
	  .attr("d", arc);
});