import React, { useEffect, useState } from "react";
import "./App.css";
import Scatterploy from "./chart/Scatterplot";
import AreaChart from "./chart/AreaChart";
import Grid from "@mui/material/Grid";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import data from "./data/data.json";
import { Typography } from "@mui/material";

function App() {
  const [chartData, setChartData] = useState();
  const [years, setYeras] = useState();
  const [selectedYear, setSelectedYear] = useState("2020");
  const [population, setPopulation] = useState();

  const [xAxisData, setXaxisData] = useState();
  const [yAxisData, setYaxisData] = useState();

  useEffect(() => {
    data.map((d) => {
      d["Population"] = d[" Population (000s) "].trim();
      d["Population_Density"] = d[" Population_Density "].trim();
      d["Population_Growth_Rate"] = d[" Population_Growth_Rate "].trim();
    });
    getYears(data);
  }, [selectedYear]);

  const getYears = (data) => {
    const years = [];
    data.map((d) => {
      years.push(d.Year);
    });
    const uniqYears = years.filter((item, i, d) => d.indexOf(item) === i);
    setYeras(uniqYears);
    getAxisData(data);
    // setSelectedYear(uniqYears[0]);
  };

  const getAxisData = (props) => {
    props.forEach((obj) => {
      obj.Population = obj.Population.replace(/,/g, "");
      obj.Population_Density = obj.Population_Density.replace(/,/g, "");
      obj.Population_Growth_Rate = obj.Population_Growth_Rate.replace(/,/g, "");
      obj.Population_Growth_Rate = obj.Population_Growth_Rate.replace(
        /[{()}]/g,
        ""
      );
    });

    const filterData = props.filter((d) => d.Year === selectedYear);
    const xAxis = [];
    const yAxis = [];
    filterData.forEach((d) => {
      // d.Population_Density = +d.Population_Density;
      xAxis.push(d.Population_Density);
      yAxis.push(d.Population_Growth_Rate);
    });
    setXaxisData(xAxis);
    setYaxisData(yAxis);
    setChartData(filterData);

    const popu = filterData.find((d) => d.Year === selectedYear);
    setPopulation(popu);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const Dropdown = (props) => {
    return (
      <>
        {years && (
          <FormControl variant="standard" sx={{ m: 1, ml: 4, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedYear}
              label="Age"
              onChange={handleYearChange}
            >
              {years.map((d, i) => {
                return (
                  <MenuItem key={i} value={d}>
                    {d}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </>
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item textAlign={"left"} xs={12} sx={{ background: "#f0f5fe" }}>
          <Dropdown />
        </Grid>

        <Grid item xs={12}>
          <Grid container p={1} spacing={0}>
            <Grid
              item
              xs={2}
              p={1}
              sx={{
                border: "1px solid",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                World Population
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                ({selectedYear})
              </Typography>
              {population && (
                <Typography
                  sx={{
                    fontSize: "42px",
                    fontWeight: 600,
                    textAlign: "center",
                    marginTop: "30px",
                  }}
                >
                  {population.Population}
                </Typography>
              )}
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                border: "1px solid",
              }}
            >
              <AreaChart
                id={"population_growth_density"}
                selectedYear={selectedYear}
                data={data}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {xAxisData && (
            <Scatterploy
              id={"population_growth_density"}
              selectedYear={selectedYear}
              xAxis={xAxisData}
              yAxis={yAxisData}
              data={chartData}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default App;
