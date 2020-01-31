function loadData(urlBase) {

    const urlData = urlBase + 'data/parsed/';
    const urlIndex = urlData + 'index.txt';

    // return new Promise((resolve, reject) => {
    return fetch(urlIndex)
        .then((response) => {
            return response.text();
        })
        .then((text) => {

            let Index = text.split('\n').map((relUrl) => { return urlData + relUrl; });

            var data = [];
            for (url of Object.values(Index))
                data.push($.getJSON(url, (obj) => { return obj; }));
            return data;
        });
    // return reject({});
    // });
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