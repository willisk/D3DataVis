

const urlBase = 'https://raw.githubusercontent.com/quenting44/desinformation/master/data/parsed/';


var all;
$.getJSON(urlBase + 'all.json', (data) => {

    all = data;
    let volumes = Object.keys(data);
    d3.select("#volume").selectAll("option")
        .data(volumes)
        .enter().append("option")
        .text(d => d)


    function update(speed = 500) {

        // update dropdown selectors
        let volumeVal = $('#volume option:selected').val();

        // sheets
        let sheets = Object.keys(data[volumeVal]);
        let sheetOptions = d3.select("#sheet").selectAll("option")
            .data(sheets)

        sheetOptions
            .exit().remove()

        sheetOptions
            .enter().append("option")
            .merge(sheetOptions)
            .text(d => `${data[volumeVal][d].phrase}`.replace(/([^\(]+).*/, '$1'))
            .property('value', d => d)

        let sheetVal = $('#sheet option:selected').val();

        // rubrics
        let rubrics = data[volumeVal][sheetVal].inquiry.map(inq => inq.key);
        let rubricOptions = d3.select("#rubric").selectAll("option")
            .data(rubrics)

        rubricOptions
            .exit().remove();

        rubricOptions
            .enter().append("option")
            .merge(rubricOptions)
            .text(d => d)

        let rubricVal = $('#rubric option:selected').index();

        // console.log(volumeVal);
        // console.log(sheetVal);
        // console.log(rubricVal);
        updateGraph(data[volumeVal][sheetVal], rubricVal, speed);
    }

    d3.select('#volume')
        .on("change", update)

    d3.select('#sheet')
        .on("change", update)

    d3.select('#rubric')
        .on("change", update)

    update(0);


});


// --------------------------------------------------
// INIT
// --------------------------------------------------

var svg = d3.select("svg");
var margin = { top: 20, right: 20, bottom: 100, left: 50 };
var width = svg.attr("width") - margin.left - margin.right;
var height = svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var xAxis = g.append("g")
    .attr("transform", "translate(0," + height + ")")

var yAxis = g.append("g");

function updateGraph(sheet, rubric, speed = 500) {

    var groups = sheet.groups.map(d => d.name);
    var data = sheet.inquiry[rubric].data[0];

    x.domain(groups);
    y.domain([0, d3.max(data)]);

    xAxis
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    yAxis
        .call(d3.axisLeft(y))

    var bars = g.selectAll(".bar")
        .data(data)

    bars
        .exit().remove();
    bars
        .enter().append("rect")
        .merge(bars)
        .attr("class", "bar")
        .transition().duration(speed)
        .attr("x", (d, i) => x(groups[i]))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d));
}
