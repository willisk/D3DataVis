function loadDataFull(urlBase) {

    const url = urlBase + 'data/parsed/all.json';
    let data = {};
    $.getJSON(url, (obj) => {
        data = obj;
    });
    console.log(data);
    return data;
}

function loadData(urlBase) {

    const urlData = urlBase + 'data/parsed/';
    const urlIndex = urlData + 'index.txt';

    // return new Promise((resolve, reject) => {
    return fetch(urlIndex)
        .then((response) => {
            return response.text();
        })
        .then((text) => {

            let files = text.split('\n');
            let Index = files.map((relUrl) => { return urlData + relUrl; });
            for (i in files)
                $.getJSON(urlData + files[i], (obj) => {
                    data.push(obj);
                });

            var data = [];
            for (url of Object.values(Index))
                $.getJSON(url, (obj) => {
                    data.push(obj);
                });
            return data;
        });
    // return reject({});
    // });
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

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("right");

// var svg = d3.select("body").append("svg")
//     .attr("width", outerWidth)
//     .attr("height", outerHeight)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var defs = svg.append("defs");

// defs.append("marker")
//     .attr("id", "triangle-start")
//     .attr("viewBox", "0 0 10 10")
//     .attr("refX", 10)
//     .attr("refY", 5)
//     .attr("markerWidth", -6)
//     .attr("markerHeight", 6)
//     .attr("orient", "auto")
//     .append("path")
//     .attr("d", "M 0 0 L 10 5 L 0 10 z");

// defs.append("marker")
//     .attr("id", "triangle-end")
//     .attr("viewBox", "0 0 10 10")
//     .attr("refX", 10)
//     .attr("refY", 5)
//     .attr("markerWidth", 6)
//     .attr("markerHeight", 6)
//     .attr("orient", "auto")
//     .append("path")
//     .attr("d", "M 0 0 L 10 5 L 0 10 z");

// svg.append("rect")
//     .attr("class", "outer")
//     .attr("width", innerWidth)
//     .attr("height", innerHeight);

// var g = svg.append("g")
//     .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

// g.append("rect")
//     .attr("class", "inner")
//     .attr("width", width)
//     .attr("height", height);

// g.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

// g.append("g")
//     .attr("class", "y axis")
//     .attr("transform", "translate(" + width + ",0)")
//     .call(yAxis);

// svg.append("line")
//     .attr("class", "arrow")
//     .attr("x2", padding.left)
//     .attr("y2", padding.top)
//     .attr("marker-end", "url(#triangle-end)");

// svg.append("line")
//     .attr("class", "arrow")
//     .attr("x1", innerWidth / 2)
//     .attr("x2", innerWidth / 2)
//     .attr("y2", padding.top)
//     .attr("marker-end", "url(#triangle-end)");

// svg.append("line")
//     .attr("class", "arrow")
//     .attr("x1", innerWidth / 2)
//     .attr("x2", innerWidth / 2)
//     .attr("y1", innerHeight - padding.bottom)
//     .attr("y2", innerHeight)
//     .attr("marker-start", "url(#triangle-start)");

// svg.append("line")
//     .attr("class", "arrow")
//     .attr("x2", padding.left)
//     .attr("y1", innerHeight / 2)
//     .attr("y2", innerHeight / 2)
//     .attr("marker-end", "url(#triangle-end)");

// svg.append("line")
//     .attr("class", "arrow")
//     .attr("x1", innerWidth)
//     .attr("x2", innerWidth - padding.right)
//     .attr("y1", innerHeight / 2)
//     .attr("y2", innerHeight / 2)
//     .attr("marker-end", "url(#triangle-end)");

// svg.append("text")
//     .text("origin")
//     .attr("y", -8);

// svg.append("circle")
//     .attr("class", "origin")
//     .attr("r", 4.5);

// g.append("text")
//     .text("translate(margin.left, margin.top)")
//     .attr("y", -8);