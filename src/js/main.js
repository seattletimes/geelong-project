var paywall = require("./lib/paywall");
setTimeout(() => paywall(12345678), 5000);

require("waypoints/lib/noframework.waypoints.min");
var d3 = Object.assign({}, require("d3-scale"), require("d3-shape"), require("d3-selection"));

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
	if (d.percentage > 100) {
		var slice_data = [d.percentage - 300, 100 - (d.percentage - 300)];
	} else {
		var slice_data = [d.percentage, 100 - d.percentage];
	}
	return {
		pie_data: slice_data,
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

// lazy load images and loopers
var lazyImages = [].slice.call(document.querySelectorAll(".lazy"));

if ("IntersectionObserver" in window) {
  let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        let lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove("lazy");
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach(function(lazyImage) {
    lazyImageObserver.observe(lazyImage);
  });
} else {
	document.addEventListener("DOMContentLoaded", function() {
	  let active = false;

	  const lazyLoad = function() {
	    if (active === false) {
	      active = true;

	      setTimeout(function() {
	        lazyImages.forEach(function(lazyImage) {
	          if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
	            lazyImage.src = lazyImage.dataset.src;
	            lazyImage.srcset = lazyImage.dataset.srcset;
	            lazyImage.classList.remove("lazy");

	            lazyImages = lazyImages.filter(function(image) {
	              return image !== lazyImage;
	            });

	            if (lazyImages.length === 0) {
	              document.removeEventListener("scroll", lazyLoad);
	              window.removeEventListener("resize", lazyLoad);
	              window.removeEventListener("orientationchange", lazyLoad);
	            }
	          }
	        });

	        active = false;
	      }, 200);
	    }
	  };

	  document.addEventListener("scroll", lazyLoad);
	  window.addEventListener("resize", lazyLoad);
	  window.addEventListener("orientationchange", lazyLoad);
	});
}