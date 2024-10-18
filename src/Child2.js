import React, { Component } from "react";
import * as d3 from "d3";

class Child2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props.data2);
  }

  componentDidUpdate() {
    console.log(this.props.data2);

    var data = this.props.data2;

    var margin = { top: 50, right: 40, bottom: 50, left: 40 },
      w = 800 - margin.left - margin.right,
      h = 400 - margin.top - margin.bottom;

    var container = d3
      .select(".child2_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_2")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const groupedData = Array.from(
      d3.rollup(
        data,
        (v) => d3.mean(v, (d) => d.tip),
        (d) => d.day
      )
    ).map(([day, tip]) => ({ day, tip }));

    d3.select(".child2_svg")
      .selectAll(".title")
      .data([0])
      .join("text")
      .attr("class", ".title")
      .attr("x", (800 - margin.right) / 2 + margin.left)
      .attr("y", margin.top / 2)
      .text("Average Tip by Day")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px");

    const x = d3
      .scaleBand()
      .domain(groupedData.map((d) => d.day))
      .range([margin.left, w])
      .padding(0.1);
    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x));

    d3.select(".child2_svg")
      .selectAll(".x_title")
      .data([0])
      .join("text")
      .attr("class", ".x_title")
      .attr("x", (800 - margin.right) / 2 + margin.left)
      .attr("y", h + margin.top + margin.bottom - 10)
      .text("Day")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px");

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(groupedData, (d) => d.tip)])
      .nice()
      .range([h, 0]);
    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));

    d3.select(".child2_svg")
      .selectAll(".y_title")
      .data([0])
      .join("text")
      .attr("class", ".y_title")
      .attr("x", -h / 2 - margin.top)
      .attr("y", margin.left / 2)
      .text("Average Tip")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("font-size", "20px");

    container
      .selectAll(".bar")
      .data(groupedData)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.day))
      .attr("y", (d) => y(d.tip))
      .attr("width", x.bandwidth())
      .attr("height", (d) => h - y(d.tip))
      .attr("fill", "#69b3a2");
  }

  render() {
    return (
      <svg className="child2_svg">
        <g className="g_2"></g>
      </svg>
    );
  }
}

export default Child2;
