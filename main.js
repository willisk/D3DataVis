

// const urlBase = 'https://raw.githubusercontent.com/quenting44/desinformation/master/data/parsed/';
const urlBase = 'http://localhost:4000/Project-Data-Visualization/';


var body = d3.select('body');

var all;
$.getJSON(urlBase + 'all.json', (data) => {

    all = data;
    appendBarChart(data);
    // appendRadarChart(data);
});



// --------------------------------------------------
// Bar Chart
// --------------------------------------------------

function appendBarChart(data) {

    // Init
    //D3

    var svg = body.append('svg')
        .attr('width', 650)
        .attr('height', 400)

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

    //Drop-Down Selectors

    body.append('span').html('<br>Volume:<br>')

    var dropDownVol = body.append("select")
        .attr("id", "volumeSelect")

    body.append('span').html('<br><br>Sheet:<br>')

    var dropDownSheet = body.append("select")
        .attr("id", "sheetSelect")

    body.append('span').html('<br>Rubric:<br>')

    var dropDownRubric = body.append("select")
        .attr("id", "rubricSelect")

    let volumes = Object.keys(data);
    dropDownVol.selectAll("option")
        .data(volumes)
        .enter().append("option")
        .text(d => d)

    dropDownVol.on("change", update)
    dropDownSheet.on("change", update)
    dropDownRubric.on("change", update)

    update(0);

    function update(speed = 500) {

        //update dropdown selectors

        let volumeVal = $('#volumeSelect option:selected').val();   //XXX try not using jQuery

        //sheets
        let sheets = Object.keys(data[volumeVal]);
        let sheetOptions = dropDownSheet.selectAll("option")
            .data(sheets)

        sheetOptions.exit()
            .remove()

        sheetOptions.enter()
            .append("option")
            .merge(sheetOptions)
            .text(d => `${data[volumeVal][d].phrase}`.replace(/([^\(]+).*/, '$1'))
            .property('value', d => d)

        let sheetVal = $('#sheetSelect option:selected').val();

        //rubrics
        let rubrics = data[volumeVal][sheetVal].inquiry.map(inq => inq.key);
        let rubricOptions = dropDownRubric.selectAll("option")
            .data(rubrics)

        rubricOptions.exit()
            .remove();

        rubricOptions.enter()
            .append("option")
            .merge(rubricOptions)
            .text(d => d)

        let rubricVal = $('#rubricSelect option:selected').index();

        updateGraph(data[volumeVal][sheetVal], rubricVal, speed);
    }

    function updateGraph(sheet, rubric, speed = 500) {

        //read data
        var groups = sheet.groups.map(d => d.name);
        var data = sheet.inquiry[rubric].data[0];

        //update axes
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
            .attr("x", (d, i) => x(groups[i]))
            .attr("y", d => y(d))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d));
    }
}

