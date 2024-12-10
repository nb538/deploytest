import React, { Component } from "react";
import * as d3 from "d3";
import "./App.css";

class Comp1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filteredData: {
        month1: [],
        month2: [],
        month3: [],
      },
      circleFill: "Sentiment",
      tweets: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.json_data !== this.props.json_data) {
      console.log("Comp1 update triggered");
      this.filterData();
    }
  }

  filterData = () => {
    const { json_data } = this.props;
    const sliceData = json_data.slice(0, 299);

    let filteredData = {
      month1: [],
      month2: [],
      month3: [],
    };

    filteredData.month1 = sliceData.filter((d) => d.Month === "March");
    filteredData.month2 = sliceData.filter((d) => d.Month === "April");
    filteredData.month3 = sliceData.filter((d) => d.Month === "May");

    this.setState({ filteredData }, this.createLayout);
  };

  createLayout = () => {
    d3.select("#layout").selectAll("*").remove();

    const width = 1400;
    const height = 600;
    const leftMargin = 90;

    const svg = d3
      .select("#layout")
      .selectAll("svg")
      .data([null])
      .join("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "white");

    const { month1, month2, month3 } = this.state.filteredData;
    const dataByMonth = [
      { month: "March", data: month1 },
      { month: "April", data: month2 },
      { month: "May", data: month3 },
    ];

    const yScale = d3
      .scaleBand()
      .domain(["March", "April", "May"])
      .range([0, height])
      .padding(0.1);

    svg
      .selectAll(".label")
      .data(["March", "April", "May"])
      .join("text")
      .attr("class", "label")
      .attr("x", leftMargin / 2)
      .attr("y", (d) => yScale(d) + yScale.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d)
      .style("fill", "#000")
      .style("font-size", "2em")
      .style("font-weight", "bold");

    const sentimentColorScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "#ECECEC", "green"]);

    dataByMonth.forEach(({ month, data }) => {
      //Set of variables used for dictating spread
      const sectionY = yScale(month) + yScale.bandwidth() / 2;
      const minY = yScale(month);
      const maxY = yScale(month) + yScale.bandwidth();

      const sectionCenterX = (width + leftMargin) / 2;
      const horizontalSpread = 1400;

      // Force Simulation Section
      const simulation = d3
        .forceSimulation(data)
        .force(
          "x",
          d3
            .forceX()
            .x(() => sectionCenterX)
            .strength(0.03)
        )
        .force("y", d3.forceY().y(sectionY).strength(1.2))
        .force("collision", d3.forceCollide().radius(14))
        .on("tick", () => {
          data.forEach((d) => {
            d.x = Math.max(
              sectionCenterX - horizontalSpread,
              Math.min(sectionCenterX + horizontalSpread, d.x)
            ); // Sets left and right bounds using center point +/- spread variable
            d.y = Math.max(minY, Math.min(maxY, d.y));
            // Sets top and bottom bounds using yscale and bandwidth respectively
          });

          // Adds circles
          svg
            .selectAll(`.circle-${month}`)
            .data(data)
            .join("circle")
            .attr("class", `circle-${month}`)
            .attr("r", 10)
            .attr("fill", (d) => sentimentColorScale(d.Sentiment))
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("stroke", "none")
            .on("click", (event, d) => this.handleCircleClick(event, d));
        });

      // Run simulation
      for (let i = 0; i < 300; i++) simulation.tick();
    });

    // Add legend to right of SVG
    const legendWidth = 40;
    const legendHeight = 420;
    const legendX = width - 100;
    const legendY = height / 2 - legendHeight / 2;

    const legendGroup = svg.append("g").attr("class", "legend");

    // Uses definition element to draw a gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    // Stops are used to position colors on the gradient
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "red");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#ECECEC");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "green");

    // Blocks of code that draw legend
    // Accesses definiton element by url
    legendGroup
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#gradient)");

    legendGroup
      .append("text")
      .attr("id", "legend-label-top")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY - 30)
      .attr("text-anchor", "middle")
      .text("Positive")
      .style("font-size", "24px")
      .style("font-weight", "bold");

    legendGroup
      .append("text")
      .attr("id", "legend-label-bottom")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY + legendHeight + 30)
      .attr("text-anchor", "middle")
      .text("Negative")
      .style("font-size", "24px")
      .style("font-weight", "bold");
  };

  // Function that handles dropdown menu selection
  handleDropChange = (event) => {
    const circleFill = event.target.value;
    this.setState({ circleFill }, () => {
      this.updateCircleColors();
    });
  };

  // Function used to update visualization without rerendering
  updateCircleColors = () => {
    const sentimentColorScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "#ECECEC", "green"]);

    const subjectivityColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(["#ECECEC", "#4467C4"]);

    // Assigns chosen colorscale to a variable and uses it to update circle color
    const colorScale =
      this.state.circleFill === "Sentiment"
        ? (d) => sentimentColorScale(d.Sentiment)
        : (d) => subjectivityColorScale(d.Subjectivity);

    d3.selectAll("circle").attr("fill", colorScale);

    // Update legend
    const legendLabel =
      this.state.circleFill === "Sentiment"
        ? ["Negative", "Positive"]
        : ["Objective", "Subjective"];
    const legendColors =
      this.state.circleFill === "Sentiment"
        ? ["red", "#ECECEC", "green"]
        : ["#ECECEC", "#4467C4"];

    const legendGroup = d3.select(".legend");

    if (this.state.circleFill === "Sentiment") {
      const gradient = d3.select("#gradient");
      gradient.selectAll("*").remove();
      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", legendColors[0]);
      gradient
        .append("stop")
        .attr("offset", "50%")
        .attr("stop-color", legendColors[1]);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", legendColors[2]);
    } else {
      const gradient = d3.select("#gradient");
      gradient.selectAll("*").remove();
      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", legendColors[0]);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", legendColors[1]);
    }

    legendGroup.select("#legend-label-top").text(legendLabel[1]);
    legendGroup.select("#legend-label-bottom").text(legendLabel[0]);
  };

  // Function listens for clicks on circles and populates tweets array accordingly
  handleCircleClick = (event, d) => {
    const { tweets } = this.state;
    const currentStroke = d3.select(event.target).attr("stroke");

    if (currentStroke === "none") {
      d3.select(event.target).attr("stroke", "black").attr("stroke-width", 4);
      this.setState({
        tweets: [d.RawTweet, ...tweets],
      });
    } else {
      d3.select(event.target).attr("stroke", "none").attr("stroke-width", 0);
      this.setState({
        tweets: tweets.filter((tweet) => tweet !== d.RawTweet),
      });
    }
  };

  // Renders visualization and div with selected tweets
  render() {
    const { circleFill, tweets } = this.state;

    return (
      <div className="upload-group">
        {this.props.json_data.length !== 0 ? (
          <div className="drop-group">
            <h1>Color By:</h1>
            <label>
              <select value={circleFill} onChange={this.handleDropChange}>
                <option value="Sentiment">Sentiment</option>
                <option value="Subjectivity">Subjectivity</option>
              </select>
            </label>
          </div>
        ) : (
          <div></div>
        )}
        <div id="layout" />
        <div id="tweets">
          <ul>
            {tweets.map((tweet, index) => (
              <li key={index} className="tweet-entry">
                {tweet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Comp1;
