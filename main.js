

const urlBase = 'https://raw.githubusercontent.com/willisk/D3DataVis/master/';

loadData(urlBase)
    .then((data) => {
        console.log(data);
    });

var svg = d3.select("body").append("svg");

// var margin = { top: 20, right: 20, bottom: 20, left: 20 },
//     padding = { top: 60, right: 60, bottom: 60, left: 60 },
//     outerWidth = 960,
//     outerHeight = 500,
//     innerWidth = outerWidth - margin.left - margin.right,
//     innerHeight = outerHeight - margin.top - margin.bottom,
//     width = innerWidth - padding.left - padding.right,
//     height = innerHeight - padding.top - padding.bottom;

// var x = d3.scale.identity()
//     .domain([0, width]);

// var y = d3.scale.identity()
//     .domain([0, height]);



function plotInquiry(data) {
    pieChart(data);
}

function pieChart(data) {

    // set the dimensions and margins of the graph
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    var data = { a: 9, b: 20, c: 30, d: 8, e: 12 }

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(data)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value(function (d) { return d.value; })
    var data_ready = pie(d3.entries(data))

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)

}
