import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  state = {
    company: "Apple", // Default Company
    selectedMonth: "November", //Default Month
  };

  componentDidMount() {
    //console.log("Component did mount");
    //console.log(this.props.csv_data); // Use this data as default. When the user will upload data this props will provide you the updated data

    //Makes default chart, unless exists
    var svg = d3.select("#chart").select("svg");
    if (svg.empty()) {
      this.drawLinechart(this.props.csv_data);
    }

    //Makes the legend just once, unless already exists
    svg = d3.select("#legend").select("svg");
    if (svg.empty()) {
      this.createLegend();
    }
  }

  componentDidUpdate() {
    this.cleaner();
    //console.log("Component did update");

    //Code used to access Dates
    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const selectedMonthIndex = monthMap[this.state.selectedMonth];

    //Filters data by Company and Date
    const filteredData = this.props.csv_data.filter((row) => {
      const rowDate = new Date(row.Date);
      return (
        row.Company === this.state.company &&
        rowDate.getMonth() === selectedMonthIndex
      );
    });

    //Checks if data populated and draws chart
    if (filteredData.length === 0) {
      console.log("No data for selected criteria.");
      this.cleaner();
    } else {
      console.log("Filtered Data: ", filteredData);
      this.drawLinechart(filteredData);
    }
  }

  //Helper function that removes old svg elements
  cleaner = () => {
    const svg = d3.select("#chart");
    svg.selectAll("*").remove();
  };

  //Function that draws the legend
  createLegend = () => {
    const svg = d3
      .select("#legend")
      .append("svg")
      .attr("width", 120)
      .attr("height", 60);

    svg
      .append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", "#b2df8a");

    svg.append("text").attr("x", 80).attr("y", 25).text("Open Line");

    svg
      .append("rect")
      .attr("x", 10)
      .attr("y", 40)
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", "#e41a1c");

    svg.append("text").attr("x", 80).attr("y", 55).text("Close Line");
  };

  //Function that draws the Line Chart
  drawLinechart = (data) => {
    //Defines the tooltip for later use
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    //Uses d3 to format Date value
    const formatDate = d3.timeFormat("%m/%d/%Y");

    //Sets size of element
    const w = 800;
    const h = 400;
    const margin = { top: 20, bottom: 60, left: 80, right: 40 };
    const width = w - margin.right - margin.left;
    const height = h - margin.top - margin.bottom;

    //Creates svg element
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svg.selectAll("*").remove();

    //Assign svg to alias for easier manipulation, such as translating
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Uses scaleTime() to generate x-axis
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.Date)))
      .range([0, width]);

    //Uses scaleLinear() to generate y-axis
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.Open, d.Close)),
        d3.max(data, (d) => Math.max(d.Open, d.Close)),
      ])
      .nice()
      .range([height, 0]);

    //Appends both axis to bottom and left
    chartGroup
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .attr("class", "x-axis");

    chartGroup.append("g").call(d3.axisLeft(yScale)).attr("class", "y-axis");

    //Titles both the X and Y axis
    chartGroup
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .text("Date");

    chartGroup
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Price");

    //Group of code that draws path for Open line using cardinal curve and appending circles
    const lineOpen = d3
      .line()
      .curve(d3.curveCardinal)
      .x((d) => xScale(new Date(d.Date)))
      .y((d) => yScale(d.Open));

    chartGroup
      .append("path")
      .data([data])
      .attr("class", "openLine")
      .attr("d", lineOpen)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("stroke-width", 2);

    //Draws circles and enables tooltip function
    chartGroup
      .selectAll(".dot-open")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-open")
      .attr("cx", (d) => xScale(new Date(d.Date)))
      .attr("cy", (d) => yScale(d.Open))
      .attr("r", 6)
      .attr("fill", "#b2df8a")
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        const difference = d.Close - d.Open;
        const absDifference = Math.abs(difference);

        const formattedDate = formatDate(new Date(d.Date));

        tooltip.style("visibility", "visible").html(
          `Date: ${formattedDate}<br>
          Open Price: ${d.Open.toFixed(2)}<br>
          Close Price: ${d.Close.toFixed(2)}<br>
          Difference: ${difference >= 0 ? "+" : "-"}${absDifference.toFixed(2)}`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 40 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    //Group of code that draws path for Close line using cardinal curve and appends circles
    const lineClose = d3
      .line()
      .curve(d3.curveCardinal)
      .x((d) => xScale(new Date(d.Date)))
      .y((d) => yScale(d.Close));

    chartGroup
      .append("path")
      .data([data])
      .attr("class", "closeLine")
      .attr("d", lineClose)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("stroke-width", 2);

    //Draws circles and enables tooltip function
    chartGroup
      .selectAll(".dot-close")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-close")
      .attr("cx", (d) => xScale(new Date(d.Date)))
      .attr("cy", (d) => yScale(d.Close))
      .attr("r", 6)
      .attr("fill", "#e41a1c")
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        const difference = d.Close - d.Open;
        const absDifference = Math.abs(difference);

        const formattedDate = formatDate(new Date(d.Date));

        tooltip.style("visibility", "visible").html(
          `Date: ${formattedDate}<br>
          Open Price: ${d.Open.toFixed(2)}<br>
          Close Price: ${d.Close.toFixed(2)}<br>
          Difference: ${difference >= 0 ? "+" : "-"}${absDifference.toFixed(2)}`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.pageY - 40 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });
  };

  //Handles changes in the radio buttons (company)
  handleRadioChange = (event) => {
    const selectedCompany = event.target.value;
    this.setState({ company: selectedCompany });
    console.log("Selected Company: ", selectedCompany);
  };

  //Handles changes in the dropdown menu (months)
  handleMonthChange = (event) => {
    this.setState({ selectedMonth: event.target.value });
    console.log("Selected Month: ", event.target.value);
  };

  render() {
    const options = ["Apple", "Microsoft", "Amazon", "Google", "Meta"]; // Use this data to create radio button
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]; // Use this data to create dropdown

    return (
      <div className="child1">
        <div className="radiogroup">
          {options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name="company"
                value={option}
                checked={this.state.company === option}
                onChange={this.handleRadioChange}
              />
              {option}
            </label>
          ))}
        </div>
        <div className="dropdown">
          <label htmlFor="monthSelect">Select Month:</label>
          <select
            id="monthSelect"
            value={this.state.selectedMonth}
            onChange={this.handleMonthChange}
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="chartgroup">
          <div id="chart"></div>
          <div id="legend"></div>
        </div>
      </div>
    );
  }
}

export default Child1;
