import React, { Component } from "react";
import * as d3 from "d3";

class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props.data1);
  }

  componentDidUpdate() {
    console.log(this.props.data1);

    var data = this.props.data1;

    var margin = { top: 50, right: 40, bottom: 50, left: 40 },
      w = 800 - margin.left - margin.right,
      h = 400 - margin.top - margin.bottom;

    var container = d3
      .select(".child1_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_1")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.select(".child1_svg")
      .selectAll(".title")
      .data([0])
      .join("text")
      .attr("class", ".title")
      .attr("x", (800 - margin.right) / 2 + margin.left)
      .attr("y", margin.top / 2)
      .text("Total Bill vs Tips")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px");

    var x_data = data.map((item) => item.total_bill);
    const x_scale = d3
      .scaleLinear()
      .domain([0, d3.max(x_data)])
      .range([margin.left, w]);
    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

    d3.select(".child1_svg")
      .selectAll(".x_title")
      .data([0])
      .join("text")
      .attr("class", ".x_title")
      .attr("x", (800 - margin.right) / 2 + margin.left)
      .attr("y", h + margin.top + margin.bottom - 10)
      .text("Total Bill")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px");

    var y_data = data.map((item) => item.tip);
    const y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(y_data)])
      .range([h, 0]);
    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y_scale));

    d3.select(".child1_svg")
      .selectAll(".y_title")
      .data([0])
      .join("text")
      .attr("class", ".y_title")
      .attr("x", -h / 2 - margin.top)
      .attr("y", margin.left / 2)
      .text("Tips")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("font-size", "20px");

    container
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", function (d) {
        return x_scale(d.total_bill);
      })
      .attr("cy", function (d) {
        return y_scale(d.tip);
      })
      .attr("r", 3)
      .style("fill", "#69b3a2");
  }

  render() {
    return (
      <svg className="child1_svg">
        <g className="g_1"></g>
      </svg>
    );
  }
}

export default Child1;
