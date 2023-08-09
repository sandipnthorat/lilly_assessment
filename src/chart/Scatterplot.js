import React, { useEffect, useState } from "react";
import * as d3 from "d3";
const csvfile = "../example";

const Scatterplot = (props) => {
  const { data, xAxis, yAxis, selectedYear } = props;
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
      });
      drawChart(data, xAxis, yAxis);
    }
  }, [props]);

  const drawChart = (data, xAxisData, yAxisData) => {
    //Get the windows current size
    const scrrenHeight = window.screen.height;
    const scrrenWidth = window.screen.width;

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 20, bottom: 80, left: 80 },
      width = scrrenWidth - 200 - margin.left - margin.right,
      height = scrrenHeight - 250 - margin.top - margin.bottom;

    // Remove existing svg object for re-rendering
    d3.select("body")
      .select("#population_growth_density")
      .select("svg")
      .remove();

    // append the svg object to the body of the page
    var svg = d3
      .select("body")
      .select("#population_growth_density")
      .append("svg")
      .attr("id", "scatter_plot")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    if (xAxisData) {
      var x = d3
        .scaleLinear()
        .domain([
          d3.min(xAxisData, (d) => {
            return d;
          }) * 1.5,
          d3.max(xAxisData, (d) => {
            return d;
          }) * 1.5,
        ])
        .range([0, width]);
      svg
        .append("g")
        .attr("id", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      d3.select("#scatter_plot")
        .append("text")
        // .attr("x", 10)
        // .attr("y", height / 2)
        // .attr("dy", ".50em")
        .attr("dx", "-20em")
        .attr("dy", "2em")
        .attr("transform", "rotate(-90)")
        .text("Population Growth (%)");
    }

    if (yAxisData) {
      // Add Y axis
      var y = d3
        .scaleLinear()
        .domain([
          d3.min(yAxisData, (d) => {
            return d;
          }),
          d3.max(yAxisData, (d) => {
            return d;
          }),
        ])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      d3.select("#scatter_plot")
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("dy", ".50em")
        .text("Population Density");
    }

    // Add a scale for bubble size
    var z = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => {
          return d.Population;
        }),
        d3.max(data, (d) => {
          return d.Population;
        }),
      ])
      .range([
        d3.min(data, (d) => {
          return d.Population;
        }),
        d3.max(data, function (d) {
          return d.Population;
        }) / 5000,
      ]);

    // Add a scale for bubble color
    if (data) {
      var myColor = d3
        .scaleOrdinal()
        .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
        .range(d3.schemeSet2);

      d3.selectAll(".tooltip").remove();

      var tooltip = d3
        .select("#chart_tooltip")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("width", "500px")
        .style("color", "white");

      var showTooltip = function (e, d) {
        tooltip.transition().duration(200);
        tooltip
          .style("opacity", 1)
          .html("Country: " + d.country)
          .style("left", e.x + 30 + "px")
          .style("top", e.y + 30 + "px");
      };

      var moveTooltip = function (e, d) {
        tooltip.style("left", e.x + 30 + "px").style("top", e.y + 30 + "px");
      };
      var hideTooltip = function (d) {
        tooltip.transition().duration(200).style("opacity", 0);
      };

      const dots = svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle");

      dots
        .attr("cx", function (d) {
          return x(d.Population_Density);
        })
        .attr("cy", function (d) {
          return y(d.Population_Growth_Rate);
        })
        .attr("r", function (d) {
          return z(d.Population) / 4;
        })
        .style("fill", function (d) {
          return myColor(d.Country);
        });

      dots.on("mouseover", (e, d) => showTooltip(e, d));
      // .on("mousemove", (e, d) => moveTooltip(e, d))
      // .on("mouseleave", (e, d) => hideTooltip(e, d));
    } //if end
  };

  return (
    <>
      <div id={"population_growth_density"}></div>
      {/* <div id="chart_tooltip"></div> */}
    </>
  );
};

export default Scatterplot;
