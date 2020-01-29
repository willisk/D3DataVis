

var jsonData;

$.getJSON('./test.json', function (obj) {
    console.log(obj.details.ProductID);
});
// https://raw.githubusercontent.com/willisk/D3DataVis/master/data/parsed/fl_464_Volume_A.json



var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500)

svg.append("text")
    .text("Edit the below to XXX change me!")
    .attr("y", 200)
    .attr("x", 120)
    .attr("font-size", 36)
    .attr("font-family", "monospace")
