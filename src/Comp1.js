import React, { Component } from "react";
import * as d3 from "d3";

class Comp1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      streamData: this.props.csv_data || null,
    };
  }

  componentDidMount() {
    const csv = this.props.csv_data;

    if (!csv || csv.length === 0) {
      console.log("No Data");
    } else {
      this.createStream();
      console.log("Stream Activated");
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.csv_data !== this.props.csv_data) {
      console.log("CSV data updated");
      this.setState({ streamData: this.props.csv_data }, () => {
        this.createStream();
      });
    }
  }

  createStream() {
    const { streamData } = this.state;

    const tooltip = d3.select("#tooltip");

    if (!streamData || streamData.length === 0) return;

    const data = streamData;
    data.forEach((d) => {
      if (!(d.Date instanceof Date)) {
        d.Date = new Date(d.Date);
      }
    });

    const stackKeys = ["GPT4", "Gemini", "PaLM2", "Claude", "LLaMA31"];
    const customLabels = ["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"];

    const stack = d3.stack().keys(stackKeys).offset(d3.stackOffsetWiggle);
    const stackedSeries = stack(data);

    const maxSum = d3.max(stackedSeries, (layer) => d3.max(layer, (d) => d[1]));

    var xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date))
      .range([50, 500]);
    var yScale = d3.scaleLinear().domain([0, maxSum]).range([300, 0]);
    var colors = ["#E41A1C", "#377EB8", "#4DAF4A", "#984EA3", "#FF7F00"];

    var areaGenerator = d3
      .area()
      .x((d) => xScale(d.data.Date))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]))
      .curve(d3.curveCardinal);

    const tooltipChart = d3.select("#tooltip-chart");
    var color = "white";

    d3.select(".container1")
      .selectAll("path")
      .data(stackedSeries)
      .join("path")
      .style("fill", (d, i) => colors[i])
      .attr("d", (d) => areaGenerator(d))
      .on("mouseover", (event, d) => {
        //console.log("Mouseover", event, d);
        tooltip.style("opacity", 1);

        const key = d.key;
        const keyIndex = stackKeys.indexOf(key);
        const monthlyData = streamData.map((entry) => ({
          month: d3.timeFormat("%b")(entry.Date),
          value: entry[key],
        }));

        const barX = d3
          .scaleBand()
          .domain(monthlyData.map((d) => d.month))
          .range([30, 340])
          .padding(0.1);

        const barY = d3
          .scaleLinear()
          .domain([0, d3.max(monthlyData, (d) => d.value)])
          .range([200, 20]);

        tooltipChart.selectAll("*").remove();

        tooltipChart
          .selectAll(".bar")
          .data(monthlyData)
          .join("rect")
          .attr("class", "bar")
          .attr("x", (d) => barX(d.month))
          .attr("y", (d) => barY(d.value))
          .attr("width", barX.bandwidth())
          .attr("height", (d) => 200 - barY(d.value))
          .style("fill", color)
          .transition()
          .duration(500)
          .style("fill", colors[keyIndex]);

        color = colors[keyIndex];

        const xAxis = d3.axisBottom(barX);
        tooltipChart
          .append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0, 200)")
          .call(xAxis);

        const yAxis = d3.axisLeft(barY);
        tooltipChart
          .append("g")
          .attr("class", "y-axis")
          .attr("transform", "translate(30,0)")
          .call(yAxis);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX - 200 + "px")
          .style("top", event.pageY + 10 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);

        tooltipChart
          .selectAll(".bar")
          .transition()
          .duration(500)
          .style("fill", "transparent");
      });

    d3.select(".x-axis")
      .attr("transform", `translate(0, 370)`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMonth.every(1))
          .tickFormat(d3.timeFormat("%b"))
      );

    const legend = d3
      .select("svg")
      .selectAll(".legend")
      .data(customLabels)
      .join("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(550, ${100 + i * 25})`);

    var colorsRev = ["#FF7F00", "#984EA3", "#4DAF4A", "#377EB8", "#E41A1C"];
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", (d, i) => colorsRev[i]);

    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 15)
      .text((d) => d)
      .style("font-size", "1.2em")
      .attr("alignment-baseline", "middle");
  }

  render() {
    return (
      <div>
        <svg
          style={{ width: 700, height: 500, marginTop: 100, marginLeft: 50 }}
        >
          <g className="container1"></g>
          <g className="x-axis"></g>
        </svg>
        <div id="tooltip">
          <svg id="tooltip-chart" width="350" height="230"></svg>
        </div>
      </div>
    );
  }
}
export default Comp1;
