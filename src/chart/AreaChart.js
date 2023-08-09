import React, { useEffect, useState } from "react";
import * as d3 from "d3";
const csvfile = "../example";

const AreaChart = (props) => {
  const { data } = props;
  useEffect(() => {
    //Read the data
    // d3.csv(
    //   "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv",
    //   function (rows) {
    //     return rows;
    //   }
    // ).then((data) => {
    //   if (data) {
    //     console.log("data --->", data);
    //     this.drawChart(data);
    //   }
    // });

    if (props.data) {
      props.data.forEach((element) => {
        element.Population = +element.Population;
        element.date = new Date(`01-01-${element.Year}`);
      });
      drawChart(data);
    }
  }, [props]);

  const drawChart = (data, xAxisData, yAxisData, years) => {
    //Get the windows current size
    const scrrenHeight = 400;
    const scrrenWidth = 850;

    // const scrrenHeight = window.screen.height;
    // const scrrenWidth = window.screen.width;

    // data.sort((a, b) => d3.ascending(a.Year, b.Year));
    // data.sort((a, b) => d3.descending(a.Year, b.Year));

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 10, bottom: 20, left: 10 },
      width = scrrenWidth - 200 - margin.left - margin.right,
      height = scrrenHeight - 200 - margin.top - margin.bottom;

    // Remove existing svg object for re-rendering
    d3.select("body")
      .select("#population_growth_area_chart")
      .select("svg")
      .remove();

    // append the svg object to the body of the page
    var svg = d3
      .select("#population_growth_area_chart")
      .append("svg")
      .attr("id", "population_area_chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      )
      .range([0, width]);

    x.ticks(1);

    const xAxis = svg
      .append("g")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickValues([x.domain()[0], x.domain()[1]]));

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => {
          return d.Population;
        }),
        d3.max(data, (d) => {
          return d.Population;
        }),
      ])
      .range([height, 0]);

    // svg.append("g").call(d3.axisLeft(y));

    // Add a scale for bubble color
    if (data) {
      // Add the area
      const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .area()
            .x(function (d) {
              return x(d.date);
            })
            .y0(y(0))
            .y1(function (d) {
              return y(d.Population);
            })
        );

      // Area chart label
      d3.select("#population_area_chart")
        .append("text")
        .attr("id", "area_label")
        .attr("x", 10)
        .attr("y", 20)
        .attr("dy", ".50em")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Population Growth");
    } //if end
  };

  return (
    <>
      <div id={"population_growth_area_chart"}></div>
    </>
  );
};

export default AreaChart;
