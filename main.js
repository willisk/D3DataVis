

// const urlBase = 'https://raw.githubusercontent.com/quenging44/desinformation/master/';
const urlBase = 'https://raw.githubusercontent.com/willisk/D3DataVis/master/';

loadDataFull(urlBase)
    .then((data) => {
        plotInquiry(data);
    });


// var svg = d3.select("body").append("svg");


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
    console.log(data)
    // pieChart(data);
}
