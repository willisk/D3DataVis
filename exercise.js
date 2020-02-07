
var width = 700,
    height = 580;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoConicConformal()
    .center([2.454071, 46.279229])
    .scale(2800);

var path = d3.geoPath() // d3.geo.path avec d3 version 3
    .projection(projection);

d3.json("https://lyondataviz.github.io/teaching/lyon1-m2/2017/data/regions.json", function (json) {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path);
});
