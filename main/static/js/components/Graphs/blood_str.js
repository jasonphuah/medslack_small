import React, {Component} from 'react';

// Import D3 components
const Chart = require('react-d3-core').Chart;
const LineChart = require('react-d3-basic').LineChart;

/****************************  GraphComp  ******************************/

class BloodSaturationGraph extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render(){

   var chartData = this.props.chartData;

   if (typeof chartData !== "undefined") {

      var chartSeries = [
         {
           field: 'spo2',
           name: 'SP',
           color: 'rgb(42, 63, 84)',
           style: {
             "stroke-width": 2,
             "stroke-opacity": 0.2,
             "fill-opacity": 0.2
           }
         }
       ];

       var width = 540,
       // setting your svg height
       height = 200,
       // setting your margins of your svg
       margins = {top: 10, right: 10, bottom: 10, left: 0},

       x = function(d) {
         return new Date(d.updated_at);
       },

       // set your x domain
       xDomain = d3.extent(chartData, function(d){ return x(d) ;}),
       // set your x range
       xRange = [0, width ],
       // your scale type 'linear', 'ordinal', 'time'... etc.
       xScale = 'time',
       xLabel = "Time";


       return(

         <LineChart
             width= {width}
             height= {height}
             data= {chartData}
             chartSeries= {chartSeries}
             x = {x}
             xScale={xScale}
           />
       )

    }

    else {
     return(
       <div></div>
     )
    }

  }

}

export default BloodSaturationGraph;
