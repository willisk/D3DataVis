

// const urlBase = 'https://raw.githubusercontent.com/quenging44/desinformation/master/data/parsed/';
const urlBase = 'https://raw.githubusercontent.com/willisk/D3DataVis/master/data/parsed/';

// var all = await $.getJSON(urlBase + 'all.json');
// var all;
// $.getJSON(urlBase + 'all.json', (obj) => {
//     all = obj;
// });


var all;
$.getJSON(urlBase + 'all.json', (data) => {

    all = data;
    let volumes = Object.keys(data);
    d3.select("#volume").selectAll("option")
        .data(volumes)
        .enter().append("option")
        .text(d => d)


    function update() {

        // update dropdown selectors
        let volumeVal = $('#volume option:selected').val();

        let sheets = Object.keys(data[volumeVal]);
        let sheetOptions = d3.select("#sheet").selectAll("option")
            .data(sheets)

        sheetOptions
            .exit().remove()

        sheetOptions
            .enter().append("option")
            .text(d => `${data[volumeVal][d].phrase}`.replace(/([^\(]+).*/, '$1'))
            .property('value', d => d)

        let sheetVal = $('#sheet option:selected').val();

        let rubrics = data[volumeVal][sheetVal].inquiry.map(inq => inq.key);
        d3.select("#rubric").selectAll("option")
            .data(rubrics)
            .enter().append("option")
            .text(d => d)

        let rubricVal = $('#rubric option:selected').val();

        console.log(volumeVal);
        console.log(sheetVal);
        console.log(rubricVal);
        updateGraph(data[volumeVal][sheetVal], rubricVal);
    }

    d3.select('#volume')
        .on("change", update)

    d3.select('#sheet')
        .on("change", update)

    d3.select('#rubric')
        .on("change", update)

    update();


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

function updateGraph(sheet, rubric) {

    var groups = sheet.groups.map(d => d.name);
    var data = sheet.inquiry.filter(d => d.key == rubric)[0].data[0]; // XXX not pretty, change

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

    var bar = g.selectAll(".bar")
        .data(data)

    bar
        .exit().remove();
    bar
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x(groups[i]))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d));
}
