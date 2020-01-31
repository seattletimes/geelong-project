var paywall = require("./lib/paywall");
setTimeout(() => paywall(12345678), 5000);

require("waypoints/lib/noframework.waypoints.min");
var d3 = require("d3");

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
