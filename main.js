

const urlBase = 'https://raw.githubusercontent.com/willisk/D3DataVis/master/';
const urlData = urlBase + 'data/parsed/';
const urlIndex = urlData + 'index.txt';

var Index;
fetch(urlIndex).then((response) => {
    response.text().then((text) => {
        Index = text.split('\n').map((relUrl) => { return urlData + relUrl; });
        fetchJson(Index[0]);
    });
});

function fetchJson(url) {
    $.getJSON(url, function (data) {
        plot(data);
    });
}

function plot(obj) {
    console.log(obj);
}


var jsonData;


console.log('called');
$.getJSON(urlIndex, function (obj) {
    console.log('called');
    console.log(obj.details.ProductID);
});

function done() {
    document.getElementById('log').textContent =
        "Here's what I got! \n" + storedText;
}



var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500)

svg.append("text")
    .text("Edit the below to XXX change me!")
    .attr("y", 200)
    .attr("x", 120)
    .attr("font-size", 36)
    .attr("font-family", "monospace")
