

// const urlBase = 'https://raw.githubusercontent.com/quenting44/desinformation/master/data/parsed/';
const urlBase = 'https://raw.githubusercontent.com/willisk/D3DataVis/master/data/parsed/';
// const urlBase = 'http://localhost:4000/Project-Data-Visualization/';




// --------------------------------------------------
// Drop-Down Selectors
// --------------------------------------------------

function DatasetSelector(data) {
    var body = d3.select('body');
    body.append('span').html('<br>Volume:<br>')

    var volumeSelect = body.append("select")
        .attr("id", "volumeSelect")

    body.append('span').html('<br><br>Sheet:<br>')

    var sheetSelect = body.append("select")
        .attr("id", "sheetSelect")

    body.append('span').html('<br>Rubric:<br>')

    var rubricSelect = body.append("select")
        .attr("id", "rubricSelect")

    this.updateCallBack = function (volumeVal, sheetVal, rubricVal, speed, isInit) { }

    this.init = function () {
        this.update(true);
    }

    this.update = function (isInit = false) {

        volumeSelect.selectAll("option")
            .data(Object.keys(data))
            .enter().append("option")
            .text(d => d)

        var volumeVal = $('#volumeSelect option:selected').val();   //XXX try not using jQuery

        //sheets
        let sheets = Object.keys(data[volumeVal]);
        var sheetOptions = sheetSelect.selectAll("option")
            .data(sheets)

        sheetOptions.exit()
            .remove()

        sheetOptions.enter()
            .append("option")
            .merge(sheetOptions)
            .text(d => `${data[volumeVal][d].phrase}`.replace(/([^\(]+).*/, '$1'))
            .property('value', d => d)

        var sheetVal = $('#sheetSelect option:selected').val();

        //rubrics
        let rubrics = data[volumeVal][sheetVal].inquiry.map(inq => inq.key);
        var rubricOptions = rubricSelect.selectAll("option")
            .data(rubrics)

        rubricOptions.exit()
            .remove();

        rubricOptions.enter()
            .append("option")
            .merge(rubricOptions)
            .text(d => d)

        var rubricVal = $('#rubricSelect option:selected').index();

        this.updateCallBack(volumeVal, sheetVal, rubricVal, isInit);
    }

    volumeSelect.on("change", this.update.bind(this))
    sheetSelect.on("change", this.update.bind(this))
    rubricSelect.on("change", this.update.bind(this))
}

// --------------------------------------------------
// Bar Chart
// --------------------------------------------------

function BarChart(svg) {

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

    this.updateGraph = function (data, xLabels, speed = 500) {

        //update axes
        x.domain(xLabels);
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

        //update bars
        var bars = g.selectAll(".bar")
            .data(data)

        bars
            .exit().remove();
        bars
            .enter().append("rect")
            .merge(bars)
            .attr("class", "bar")
            .transition().duration(speed)
            .attr("x", (d, i) => x(xLabels[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d));
    }
}

var margin = { top: 50, right: 80, bottom: 50, left: 80 },
    width = Math.min(400, window.innerWidth / 4) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

var radarChartOptions = {
    w: 650,
    h: 350,
    margin: margin,
    maxValue: 60,
    levels: 6,
    roundStrokes: false,
    // color: d3.scaleOrdinal().range(["#AFC52F", "#ff6600", "#2a2fd4"]),
    format: '.0f',
    legend: { title: '', translateX: 100, translateY: 40 },
    unit: ''
};

var all;
$.getJSON(urlBase + 'all.json', (data) => {

    all = data; //for debugging

    filterGroup(data["fl_464_Volume_A"], 'UE28');
    filterGroup(data["fl_464_Volume_B"], 'UE28');



    var body = d3.select('body');

    var svg = body.append('svg')
        .attr('width', 650)
        .attr('height', 400)

    var bChart = new BarChart(svg);

    sel = new DatasetSelector(data);
    sel.updateCallBack = function (volumeVal, sheetVal, rubricVal, isInit) {
        let sheet = data[volumeVal][sheetVal];
        let groups = sheet.groups.map(d => d.name);

        let barData = sheet.inquiry[rubricVal].data[0];
        let speed = isInit ? 0 : 500;
        bChart.updateGraph(barData, groups, speed);

        var radarData = sheet.groups.map(function (d, i) {
            return {
                name: d.name,
                axes: sheet.inquiry.map(function (d) {
                    return {
                        axis: d.key,
                        value: d.data[0][i]
                    };
                })
            };
        });
        let svg_radar2 = RadarChart(".radarChart2", radarData, radarChartOptions);
    };
    sel.init();
});




















// --------------------------------------------------
// Radar Chart
// --------------------------------------------------
//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

// //////////////////////////////////////////////////////////////
// ////////////////////////// Data //////////////////////////////
// //////////////////////////////////////////////////////////////

// var data = [
//     {
//         name: 'Allocated budget',
//         axes: [
//             { axis: 'Sales', value: 42 },
//             { axis: 'Marketing', value: 20 },
//             { axis: 'Development', value: 60 },
//             { axis: 'Customer Support', value: 26 },
//             { axis: 'Information Technology', value: 35 },
//             { axis: 'Administration', value: 20 }
//         ],
//     },
//     {
//         name: 'Actual Spending',
//         axes: [
//             { axis: 'Sales', value: 50 },
//             { axis: 'Marketing', value: 45 },
//             { axis: 'Development', value: 20 },
//             { axis: 'Customer Support', value: 20 },
//             { axis: 'Information Technology', value: 25 },
//             { axis: 'Administration', value: 23 }
//         ],
//     },
//     {
//         name: 'blah Test',
//         axes: [
//             { axis: 'Sales', value: 32 },
//             { axis: 'Marketing', value: 62 },
//             { axis: 'Development', value: 35 },
//             { axis: 'Customer Support', value: 10 },
//             { axis: 'Information Technology', value: 20 },
//             { axis: 'Administration', value: 28 }
//         ],
//     }
// ];

// //////////////////////////////////////////////////////////////
// ///// Second example /////////////////////////////////////////
// ///// Chart legend, custom color, custom unit, etc. //////////
// //////////////////////////////////////////////////////////////

// // Draw the chart, get a reference the created svg element :
// let svg_radar2 = RadarChart(".radarChart2", data, radarChartOptions2);

























