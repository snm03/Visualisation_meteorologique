// Define initial values for data
const initalVal = {
  colors: ["#264653", "#2a9d8f", "#e9c46a", "#e76f51"],
  data: "weather",
  year: 2012,
  xLable: "Weather",
  yLable: "Year",
  legends: ["Q1-2012", "Q2-2012", "Q3-2012", "Q4-2012"],
  chartWidth: 320,
};

// Define all header columns of CSV files
const dataColumn = [
  "date",
  "precipitation",
  "temp_max",
  "temp_min",
  "wind",
  "weather",
];

// Define weather types
const weatherTypes = ["drizzle", "rain", "sun", "snow", "fog"];
const years = [2012, 2013, 2014, 2015];

// Define function to find Qaurter
const findQuarter = (date) => {
  const [year, month, day] = date.split("-");
  if (month >= 1 && month < 4) {
    return "Q1";
  } else if (month >= 4 && month < 7) {
    return "Q2";
  } else if (month >= 7 && month < 10) {
    return "Q3";
  } else {
    return "Q4";
  }
};
// Sort data by type
const sortDataType = (data, type) => {
  const models = [];
  switch (type) {
    case "weather":
      if (!initalVal.year) {
        weatherTypes.forEach((el) => {
          models.push({
            main: el,
            Y1: data.filter((x) => x.weather == el && x.year == 2012).length,
            Y2: data.filter((x) => x.weather == el && x.year == 2013).length,
            Y3: data.filter((x) => x.weather == el && x.year == 2014).length,
            Y4: data.filter((x) => x.weather == el && x.year == 2015).length,
          });
        });
      } else {
        weatherTypes.forEach((el) => {
          models.push({
            main: el,
            Y1: data.filter(
              (x) =>
                x.weather == el && x.year == initalVal.year && x.quarter == "Q1"
            ).length,
            Y2: data.filter(
              (x) =>
                x.weather == el && x.year == initalVal.year && x.quarter == "Q2"
            ).length,
            Y3: data.filter(
              (x) =>
                x.weather == el && x.year == initalVal.year && x.quarter == "Q3"
            ).length,
            Y4: data.filter(
              (x) =>
                x.weather == el && x.year == initalVal.year && x.quarter == "Q4"
            ).length,
          });
        });
      }
      break;
    case "precipitation":
      if (!initalVal.year) {
        years.forEach((el) => {
          models.push({
            main: el,
            Y1: data
              .filter((x) => x.year == el && x.quarter == "Q1")
              .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
            Y2: data
              .filter((x) => x.year == el && x.quarter == "Q2")
              .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
            Y3: data
              .filter((x) => x.year == el && x.quarter == "Q3")
              .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
            Y4: data
              .filter((x) => x.year == el && x.quarter == "Q4")
              .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
          });
        });
      } else {
        models.push({
          main: initalVal.year,
          Y1: data
            .filter((x) => x.year == initalVal.year && x.quarter == "Q1")
            .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
          Y2: data
            .filter((x) => x.year == initalVal.year && x.quarter == "Q2")
            .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
          Y3: data
            .filter((x) => x.year == initalVal.year && x.quarter == "Q3")
            .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
          Y4: data
            .filter((x) => x.year == initalVal.year && x.quarter == "Q4")
            .reduce((acc, curr) => acc + curr.precipitation * 1, 0),
        });
      }
      break;

    default:
      break;
  }
  return models;
};
// Define function to update initalVal values
const updateinitalVal = () => {
  if (initalVal.data != "temp" && initalVal.year != "") {
    initalVal.legends = [
      `Q1-${initalVal.year}`,
      `Q2-${initalVal.year}`,
      `Q3-${initalVal.year}`,
      `Q4-${initalVal.year}`,
    ];
  } else if (initalVal.data != "temp" && initalVal.year == "") {
    initalVal.legends = ["2012", "2013", "2014", "2015"];
  } else {
    initalVal.legends = [
      `temp_min-${initalVal.year}`,
      `temp_max-${initalVal.year}`,
    ];
  }
  if (initalVal.data == "weather") {
    initalVal.xLable = "Weather";
    initalVal.yLable = "Days";
  } else if (initalVal.data == "precipitation") {
    initalVal.xLable = "Year";
    initalVal.yLable = "Precipitation";
  } else {
    initalVal.xLable = "Day";
    initalVal.yLable = "Temp";
  }
};

// Draw chart with D3 library
const drawChart = async (initalVal) => {
  document.getElementById("d3").textContent = "";
  const filteredData = [];
  try {
    const data = await d3.dsv(",", "./assets/data/seattle-weather.csv");
    years.forEach((year) => {
      data
        .filter((x) => x.date.includes(year))
        .forEach((el) => {
          filteredData.push({
            weather: el.weather,
            precipitation: el.precipitation,
            year,
            quarter: findQuarter(el.date),
          });
        });
    });
    const models = sortDataType(filteredData, initalVal.data);
    const headers = models.map((el) => el.main);
    const subgroups = ["Y1", "Y2", "Y3", "Y4"];

    // set the dimensions and margins of the graph
    const margin = { top: 40, right: 30, bottom: 90, left: 50 },
      width = initalVal.chartWidth,
      height = 600;

    // append the svg object to the body of the page
    const svg = d3
      .select("#d3")
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal().range(initalVal.colors);

    const x = d3.scaleBand().domain(headers).range([0, width]).padding([0.2]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0));

    svg
      .selectAll("text")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(models, (d) => {
          if (Math.max(d.Y1, d.Y2, d.Y3, d.Y4) == d.Y1) {
            return d.Y1;
          } else if (Math.max(d.Y1, d.Y2, d.Y3, d.Y4) == d.Y2) {
            return d.Y2;
          } else if (Math.max(d.Y1, d.Y2, d.Y3, d.Y4) == d.Y3) {
            return d.Y3;
          } else if (Math.max(d.Y1, d.Y2, d.Y3, d.Y4) == d.Y4) {
            return d.Y4;
          }
        }),
      ])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // Another scale for subgroup position?
    const xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    // Show the bars
    svg
      .append("g")
      .selectAll("g")
      // Enter in data = loop main per main
      .data(models)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.main)}, 0)`)
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key));

    // text label for the X axis
    svg
      .append("text")
      .attr("transform", `translate(${width / 2}  , ${height + 50})`)
      .style("text-anchor", "middle")
      .text(initalVal.xLable);

    // text lable for the Y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(initalVal.yLable);

    // Create Legend
    const xLegend = 0;
    svg
      .append("circle")
      .attr("cx", xLegend - 30)
      .attr("cy", height + 20)
      .attr("r", 6)
      .style("fill", initalVal.colors[0])
      .style("stroke", "black");
    svg
      .append("circle")
      .attr("cx", xLegend - 30)
      .attr("cy", height + 40)
      .attr("r", 6)
      .style("fill", initalVal.colors[1])
      .style("stroke", "black");
    svg
      .append("circle")
      .attr("cx", xLegend - 30)
      .attr("cy", height + 60)
      .attr("r", 6)
      .style("fill", initalVal.colors[2])
      .style("stroke", "black");
    svg
      .append("circle")
      .attr("cx", xLegend - 30)
      .attr("cy", height + 80)
      .attr("r", 6)
      .style("fill", initalVal.colors[3])
      .style("stroke", "black");

    svg
      .append("text")
      .attr("x", xLegend - 10)
      .attr("y", height + 20)
      .text(initalVal.legends[0])
      .style("fill", initalVal.colors[0])
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", xLegend - 10)
      .attr("y", height + 40)
      .text(initalVal.legends[1])
      .style("fill", initalVal.colors[1])
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", xLegend - 10)
      .attr("y", height + 60)
      .text(initalVal.legends[2])
      .style("fill", initalVal.colors[2])
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", xLegend - 10)
      .attr("y", height + 80)
      .text(initalVal.legends[3])
      .style("fill", initalVal.colors[3])
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  } catch (error) {
    console.error(error);
  }
};

// Draw scatter with D3 library
const drawScatter = async (initalVal) => {
  document.getElementById("d3").textContent = "";
  const filteredData = [];
  try {
    const data = await d3.dsv(",", "./assets/data/seattle-weather.csv");
    ["temp_min", "temp_max"].forEach((tempType) => {
      data
        .filter((x) => x.date.includes(initalVal.year))
        .forEach((el, index) => {
          filteredData.push({
            temp: el[tempType],
            type: tempType,
            date: index + 1,
          });
        });
    });

    const sumstat = d3.group(filteredData, (d) => d.type); // nest function allows to group the calculation per level of a factor

    const container = d3.select("#d3"),
      width = initalVal.chartWidth,
      height = 600,
      margin = { top: 40, right: 20, bottom: 80, left: 50 };

    const svg = container
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height + 100}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3
      .scaleLinear()
      .domain(
        d3.extent(filteredData, function (d) {
          return d.date;
        })
      )
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(filteredData, function (d) {
          return +d.temp;
        }),
      ])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // color palette
    const color = d3.scaleOrdinal().range(initalVal.colors);

    // Draw the line
    svg
      .selectAll(".line")
      .data(sumstat)
      .join("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d[0]);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            // return y(+d.temp_min);
            return y(d.temp);
          })(d[1]);
      });

    // text label for the X axis
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${width / 2}  , ${height + margin.bottom / 2})`
      )
      .style("text-anchor", "middle")
      .text(initalVal.xLable);

    // text lable for the Y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(initalVal.yLable);
    // Create Legend
    const xLegend = 0;
    svg
      .append("circle")
      .attr("cx", xLegend - 30)
      .attr("cy", height + margin.bottom / 2 + 10)
      .attr("r", 6)
      .style("fill", initalVal.colors[0])
      .style("stroke", "black");
    svg
      .append("circle")
      .attr("cx", xLegend - 30)
      .attr("cy", height + margin.bottom / 2 - 5)
      .attr("r", 6)
      .style("fill", initalVal.colors[1])
      .style("stroke", "black");

    svg
      .append("text")
      .attr("x", xLegend - 10)
      .attr("y", height + margin.bottom / 2 + 10)
      .text(initalVal.legends[0])
      .style("fill", initalVal.colors[0])
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", xLegend - 10)
      .attr("y", height + margin.bottom / 2 - 5)
      .text(initalVal.legends[1])
      .style("fill", initalVal.colors[1])
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  } catch (error) {
    console.error(error);
  }
};

// DOM Element
const DOMElements = {
  year: document.getElementById("year"),
  chartData: document.getElementById("parameter-chart-data"),
  chartDataInputs: document.getElementsByName("chart_data"),
  d3: document.getElementById("d3"),
};
// DOM update function
const generateYearsElement = () => {
  DOMElements.year.textContent = "";
  let newOptions = "";
  if (initalVal.data == "temp") {
    newOptions = `
      <option selected value="2012">2012</option>
      <option value="2013">2013</option>
      <option value="2014">2014</option>
      <option value="2015">2015</option>
    `;
  } else {
    newOptions = `
      <option value="">2012 - 2015</option>
      <option selected value="2012">2012</option>
      <option value="2013">2013</option>
      <option value="2014">2014</option>
      <option value="2015">2015</option>
    `;
  }
  initalVal.year = 2012;
  updateinitalVal();
  DOMElements.year.insertAdjacentHTML("afterbegin", newOptions);
};
// Define chart width
const chartWidth = () => {
  if (window.innerWidth < 600) {
    initalVal.chartWidth = 320;
  }
  if (window.innerWidth >= 600 && window.innerWidth < 768) {
    initalVal.chartWidth = 500;
  }
  if (window.innerWidth >= 768) {
    initalVal.chartWidth = 600;
  }
};

// Event Handler
DOMElements.year.addEventListener("change", () => {
  initalVal.year = DOMElements.year.value;
  updateinitalVal();
  initalVal.data != "temp" ? drawChart(initalVal) : drawScatter(initalVal);
});

DOMElements.chartData.addEventListener("change", () => {
  DOMElements.chartDataInputs.forEach((el) => {
    if (el.checked) initalVal.data = el.value;
  });
  updateinitalVal();
  generateYearsElement();
  initalVal.data != "temp" ? drawChart(initalVal) : drawScatter(initalVal);
});

document.addEventListener("DOMContentLoaded", () => {
  chartWidth();
  drawChart(initalVal);
});

window.addEventListener("resize", () => {
  chartWidth();
  updateinitalVal();
});
